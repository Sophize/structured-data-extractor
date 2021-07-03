import { Injectable } from '@angular/core';
import { AbstractDataProvider, defaultResourceOverlayAction } from 'ngx-sophize-md-renderer';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  emptyTruthStatus,
  Language,
  Resource,
  ResourcePointer,
  ResourceType,
} from 'sophize-datamodel';
import { ResourceServer } from './resource-server.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class LocalDataProvider implements AbstractDataProvider {
  constructor(
    private workspace: WorkspaceService,
    private resourceServer: ResourceServer
  ) {}

  getResources(ptrs: ResourcePointer[]): Observable<Resource[]> {
    const loaded = new Map<string, Resource>();
    const toFetch = [] as ResourcePointer[];
    ptrs.forEach((ptr) => {
      const loadedResource = this.workspace.getLoadedResource(ptr);
      if (loadedResource) loaded.set(ptr.toString(), loadedResource.updated);
      else toFetch.push(ptr);
    });

    return this.resourceServer.getResources(toFetch).pipe(
      map((fetched) => {
        for (let i = 0; i < toFetch.length; i++) {
          loaded.set(toFetch[i].toString(), fetched[i]);
        }
        return ptrs.map((ptr) => loaded.get(ptr.toString()));
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
    return this.resourceServer.getLatexDefs(language, keys);
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
    defaultResourceOverlayAction(resourcePtr, dialog);
  }
}
