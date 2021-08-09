import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ResourcePointer } from 'sophize-datamodel';
import { save, State } from '../edit-panel/edit-panel.component';
import { getPtrUsingDialog } from '../form-elements/ptr-picker/ptr-picker.component';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss'],
})
export class ActionPanelComponent {
  State = State;
  state = State.IDLE;
  status = '';

  constructor(private workspace: WorkspaceService, private dialog: MatDialog) {}

  async load() {
    const ptr = (await lastValueFrom(getPtrUsingDialog(this.dialog)))?.ptr;
    if (!ptr) return;
    try {
      this.state = State.LOAD;
      await lastValueFrom(this.workspace.load(ptr));
    } catch (e) {
      alert('Failed to load resource: ' + e);
    } finally {
      this.state = State.IDLE;
    }
  }

  async addNew() {
    const samplePtr = ResourcePointer.fromString('test/T_new');
    const ptr = (await lastValueFrom(getPtrUsingDialog(this.dialog, samplePtr)))
      ?.ptr;
    if (!ptr) return;
    if (this.workspace.getLoadedResource(ptr)) {
      alert('already loaded');
      this.workspace.selectedPtr$.next(ptr);
      return;
    }
    this.workspace.createNew(ptr, {});
  }

  async saveAll() {
    let numSaved = 0;
    const keys = [...this.workspace.getLoadedResources().keys()];
    for (const ptrStr of keys) {
      try {
        await save(
          ResourcePointer.fromString(ptrStr),
          this.workspace,
          (state) => (this.state = state)
        );
        numSaved++;
      } catch (e) {
        this.status = `Error saving ${ptrStr}: ${e}`;
        return;
      }
    }
    this.status = `Saved ${numSaved} resources.`;
  }

  unload() {
    for (const ptrStr of this.workspace.getLoadedResources().keys()) {
      this.workspace.unload(ResourcePointer.fromString(ptrStr), false);
    }
  }
}
