import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AbstractDataProvider } from 'ngx-sophize-md-renderer';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  emptyTruthStatus,
  Language,
  Resource,
  ResourcePointer,
  ResourceType,
} from 'sophize-datamodel';

@Injectable()
export class LocalDataProvider1 implements AbstractDataProvider {
  metamathKeys = new Map<string, string>();
  constructor(
    @Inject('ServerAddress1') private serverAddress: string,
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

  getResources(ptrs: ResourcePointer[]): Observable<Resource[]> {
    console.log('Application waala! ');
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

  getPages(ptr: ResourcePointer) {
    return of([]);
  }

  getTruthStatus(beliefsetPtr: ResourcePointer, targetPtr: ResourcePointer) {
    return of(emptyTruthStatus(beliefsetPtr, targetPtr));
  }

  getMachineStatus(beliefsetPtr: ResourcePointer, machinePtr: ResourcePointer) {
    return of(false);
  }

  getLatexDefs(language: Language, keys: string[]) {
    if (language !== Language.MetamathSetMm) return of(keys);
    return of(keys.map((key) => this.metamathKeys.get(key) || key));
  }

  inUseBeliefset$ = new BehaviorSubject<ResourcePointer>(
    ResourcePointer.assignablePtr('wiki', ResourceType.BELIEFSET, 'default')
  );

  getResourceNavRoute(resourcePtr: ResourcePointer): string {
    return [
      'https://sophize.org/s',
      resourcePtr.datasetId,
      resourcePtr.resourceShowId,
    ].join('/');
  }

  getPageNavRoute(resourcePtr: ResourcePointer, pageId: string): string {
    return [this.getResourceNavRoute(resourcePtr), pageId].join('/');
  }

  getCommentFragment(commentId: number): string {
    return !commentId ? undefined : 'comment-' + commentId;
  }

  onResourceOverlayAction(resourcePtr: ResourcePointer, dialog?: any): void {
    return;
  }
}
