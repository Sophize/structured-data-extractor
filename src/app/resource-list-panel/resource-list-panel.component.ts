import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { debounceTime } from 'rxjs/operators';
import { ResourcePointer } from 'sophize-datamodel';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-resource-list-panel',
  templateUrl: './resource-list-panel.component.html',
  styleUrls: ['./resource-list-panel.component.scss'],
})
export class ResourceListPanelComponent implements OnInit {
  resourcePtrList = [] as string[];
  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.updateList();
    this.workspaceService.loadedResourceSubject$
      .pipe(debounceTime(500))
      .subscribe((_) => this.updateList());
  }

  updateList() {
    this.resourcePtrList = [
      ...this.workspaceService.getLoadedResources().keys(),
    ];
  }

  onSelectionChange(event: MatSelectionListChange) {
    const ptr = ResourcePointer.fromString(
      event.source?.selectedOptions?.selected[0]?.value
    );
    this.workspaceService.selectedPtr$.next(ptr);
  }
}
