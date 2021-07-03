import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import {
  Language,
  ResourcePointer,
  ResourceType,
  Term,
} from 'sophize-datamodel';
import { WorkspaceService } from '../workspace.service';

export enum State {
  IDLE,
  LOAD,
  SAVE,
  RESET,
}

export async function save(
  ptr: ResourcePointer,
  workspace: WorkspaceService,
  stateUpdater: (arg0: State) => void
) {
  if (!ptr) return;
  try {
    stateUpdater(State.SAVE);
    await lastValueFrom(workspace.save(ptr));
  } catch (e) {
    alert('save failed: ' + e);
  } finally {
    stateUpdater(State.IDLE);
  }
}

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss'],
})
export class EditPanelComponent implements OnInit {
  ResourceType = ResourceType;
  ptr: ResourcePointer = null;
  resource = null;
  state = State.IDLE;

  control = new FormControl();
  form = null as FormGroup;

  constructor(private fb: FormBuilder, private workspace: WorkspaceService) {}

  ngOnInit(): void {
    this.workspace.selectedPtr$.subscribe((ptr) => {
      this.ptr = ptr;
      this.refetch();
    });
  }

  refetch() {
    this.resource = this.workspace.getLoadedResource(this.ptr)?.updated;
    if (this.resource) {
      console.log(this.resource as Term);
      this.control.setValue((this.resource as Term).definition);
    }
  }
  
  async save() {
    await save(this.ptr, this.workspace, (state) => (this.state = state));
  }

  async reset() {
    const ptr = this.ptr;
    const unloaded = this.unload();
    if (!unloaded) return;
    try {
      this.state = State.LOAD;
      await lastValueFrom(this.workspace.load(ptr));
    } catch (e) {
      alert('Failed to reload resource: ' + e);
    } finally {
      this.state = State.IDLE;
      this.workspace.selectedPtr$.next(ptr);
    }
  }

  unload() {
    let unloaded = false;
    try {
      unloaded = this.workspace.unload(this.ptr, false);
    } catch (e) {
      const discard = confirm(
        'There may be unsaved changes. Are you sure you want to discard them?'
      );
      if (discard) unloaded = this.workspace.unload(this.ptr, true);
    }
    if (unloaded) this.workspace.selectedPtr$.next(null);
    return unloaded;
  }
}
