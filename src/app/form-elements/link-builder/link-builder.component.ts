import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ResourcePointer } from 'sophize-datamodel';

export interface LinkBuilderData {
  linkText: string;
  contextPtr: ResourcePointer;
}

export function getLinkedMdText(
  dialog: MatDialog,
  linkText: string,
  contextPtr: ResourcePointer
): Observable<string> {
  return dialog
    .open(LinkBuilderComponent, {
      data: { linkText, contextPtr },
    })
    .afterClosed();
}

@Component({
  selector: 'app-link-builder',
  templateUrl: './link-builder.component.html',
  styleUrls: ['./link-builder.component.scss'],
})
export class LinkBuilderComponent {
  constructor(
    private dialogRef: MatDialogRef<LinkBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LinkBuilderData
  ) {}

  linkTextOption = '';
  linkType = '';
  inputPtr = '';
  chosenPtr: ResourcePointer = null;
  linkedMdControl = new FormControl('#');

  onChange() {
    this.chosenPtr = ResourcePointer.fromString(
      this.inputPtr,
      this.data.contextPtr.datasetId
    );
    this.recreateLinkedMd();
  }

  recreateLinkedMd() {
    if (!this.chosenPtr) return;
    const ptrPart = this.chosenPtr.toString(this.data.contextPtr.datasetId);
    let linkedMdText;
    if (this.linkTextOption === 'CUSTOM') {
      if (!this.linkType)
        linkedMdText = `#(${ptrPart}, '${this.data.linkText}')`;
      else
        linkedMdText = `#(${ptrPart}, '${this.data.linkText}'|${this.linkType})`;
    } else {
      const parts = [ptrPart, this.linkTextOption, this.linkType].filter(
        (part) => !!part
      );
      linkedMdText = '#' + parts.join('|');
    }
    this.linkedMdControl.setValue(linkedMdText);
  }
}
