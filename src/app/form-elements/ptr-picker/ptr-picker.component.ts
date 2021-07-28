import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PointerType, ResourcePointer, ResourceType } from 'sophize-datamodel';

export interface PtrPickerData {
  samplePtr?: ResourcePointer;
  expandCheck?: boolean;
}

export interface PtrPickerOutput {
  ptr: ResourcePointer;
  shouldReplace?: boolean;
}

export function getPtrUsingDialog(
  dialog: MatDialog,
  samplePtr?: ResourcePointer,
  expandCheck?: boolean
): Observable<PtrPickerOutput> {
  return dialog
    .open(PtrPickerComponent, {
      data: { samplePtr, expandCheck },
    })
    .afterClosed();
}

@Component({
  selector: 'app-ptr-picker',
  templateUrl: './ptr-picker.component.html',
  styleUrls: ['./ptr-picker.component.scss'],
})
export class PtrPickerComponent {
  readonly defaultPtr = ResourcePointer.fromString('wiki/T_cone');

  constructor(
    private dialogRef: MatDialogRef<PtrPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PtrPickerData
  ) {}

  input = '';
  chosenPtr: ResourcePointer = null;
  shouldReplace = false;

  getSamplePtr() {
    return this.data.samplePtr || this.defaultPtr;
  }

  onChange() {
    this.chosenPtr = ResourcePointer.fromString(this.input);
  }

  onKeydown(event) {
    if (!event.shiftKey && event.key === 'Enter' && this.chosenPtr) {
      this.dialogRef.close(this.output());
    }
  }

  output(): PtrPickerOutput {
    return { ptr: this.chosenPtr, shouldReplace: this.shouldReplace };
  }
}
