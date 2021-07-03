import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, of, Subject } from 'rxjs';
import { delayWhen, map } from 'rxjs/operators';
import { Resource, ResourcePointer } from 'sophize-datamodel';
import { ResourceServer } from './resource-server.service';

interface LoadedResource {
  original?: Resource;
  updated: Resource;
}

function deepCopy(obj: any, fromJsonObjFunc?) {
  if (!fromJsonObjFunc) fromJsonObjFunc = (a) => a;
  return fromJsonObjFunc(JSON.parse(JSON.stringify(obj)));
}

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  // TODO: Don't expose as is.
  loadedResources = new Map<string, LoadedResource>(); // Key: ResourcePointer.toString

  selectedPtr$ = new BehaviorSubject(null as ResourcePointer);

  // TODO: expose only as an observable.
  loadedResourceSubject$ = new Subject<any>();

  constructor(private resourceServer: ResourceServer) {
    if (localStorage.loadedResources) {
      this.loadedResources = new Map(JSON.parse(localStorage.loadedResources));
      console.log(this.loadedResources.keys());
      this.loadedResourceSubject$.next({});
    }

    interval(5000).subscribe((_) => {
      localStorage.loadedResources = JSON.stringify(
        Array.from(this.loadedResources.entries())
      );
    });
  }

  getLoadedResources() {
    return this.loadedResources;
  }

  getLoadedResource(ptr: ResourcePointer) {
    if (!ptr) return null;
    return this.loadedResources.get(this.ptrToKey(ptr));
  }

  isLoaded(ptr: ResourcePointer) {
    return this.loadedResources.has(this.ptrToKey(ptr));
  }

  load(ptr: ResourcePointer): Observable<LoadedResource> {
    if (this.isLoaded(ptr)) throw new Error('Already loaded');

    return this.resourceServer.getResources([ptr]).pipe(
      map((resources) => {
        if (!resources?.[0]) throw new Error('Resource not found');
        const loadedResource = {
          original: resources[0],
          updated: deepCopy(resources[0]),
        };
        this.loadedResources.set(this.ptrToKey(ptr), loadedResource);
        this.loadedResourceSubject$.next({});
        return loadedResource;
      })
    );
  }

  unload(ptr: ResourcePointer, allowDiscard: boolean): boolean {
    if (!this.isLoaded(ptr)) throw new Error('Resource not loaded');

    if (allowDiscard || !this.isModified(ptr)) {
      const v = this.loadedResources.delete(this.ptrToKey(ptr));
      this.loadedResourceSubject$.next({});
      return v;
    }
    return false;
  }

  createNew(ptr: ResourcePointer, resource: Resource) {
    if (this.isLoaded(ptr)) throw new Error('Already loaded');

    const loadedResource = { original: {}, updated: resource };
    this.loadedResources.set(this.ptrToKey(ptr), loadedResource);
    this.loadedResourceSubject$.next({});
  }

  updateLoaded(ptr: ResourcePointer, updated: Resource) {
    if (!this.isLoaded(ptr)) throw new Error('Resource not loaded');
    this.getLoadedResource(ptr).updated = updated;
  }

  isModified(ptr: ResourcePointer): boolean {
    const loadedResource = this.getLoadedResource(ptr);
    if (!this.loadedResources) return false;
    return (
      JSON.stringify(loadedResource.original) !==
      JSON.stringify(loadedResource.updated)
    );
  }

  save(ptr: ResourcePointer, unload?: boolean) {
    const updated = this.getLoadedResource(ptr)?.updated;
    if (!updated) throw new Error('Resource not found');
    return this.resourceServer.saveResource(ptr, updated).pipe(
      delayWhen((_) => {
        this.unload(ptr, true);
        if (unload) return of({});
        return this.load(ptr);
      })
    );
  }

  ptrToKey(ptr: ResourcePointer) {
    return ptr.toString();
  }
}
