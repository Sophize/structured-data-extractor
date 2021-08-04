import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Language, Resource, ResourcePointer } from 'sophize-datamodel';

@Injectable({
  providedIn: 'root',
})
export class ResourceServer {
  metamathKeys = new Map<string, string>();
  constructor(
    @Inject('ResourceServerAddress') private serverAddress: string,
    private http: HttpClient
  ) {
    console.log('Server address: ' + serverAddress);
    this.http
      .get(serverAddress + '/metamath_set_mm_latex_map')
      .subscribe((response) => {
        for (const v in response) {
          this.metamathKeys[v] = response[v];
        }
        console.log(this.metamathKeys);
      }, console.log);
  }

  getLatexDefs(language: Language, keys: string[]) {
    if (language !== Language.MetamathSetMm) return of(keys);
    return of(keys.map((key) => this.metamathKeys.get(key) || key));
  }

  getResources(ptrs: ResourcePointer[]): Observable<Resource[]> {
    if(!ptrs?.length) return of([]);
    return forkJoin(
      ptrs.map((ptr) => {
        const url = [
          this.serverAddress,
          ptr.datasetId,
          ptr.resourceShowId + '.json',
        ].join('/');

        return this.http.get(url).pipe(
          catchError((_) => of(null)),
          map((response) => {
            console.log(response);
            if (response) {
              response['assignablePtr'] = response['permanentPtr'] =
                '#' + ptr.toString();
            }
            return response as Resource;
          })
        );
      })
    );
  }

  saveResource(ptr: ResourcePointer, resource: Resource): Observable<any> {
    const url = [
      this.serverAddress,
      ptr.datasetId,
      ptr.resourceShowId + '.json',
    ].join('/');
    return this.http.post(url, resource);
  }
}
