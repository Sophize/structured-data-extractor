import { Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-string-list-selector',
  templateUrl: './string-list-selector.component.html',
  styleUrls: ['./string-list-selector.component.scss'],
})
export class StringListSelectorComponent {
  @Input()
  formArray: FormArray = new FormArray([]);

  @Input()
  placeholder: string;

  @Input()
  editingFrozen = false;

  @Input()
  horizontalView = true;

  @Input()
  useMarkdown = false;

  newItem = '';

  onAddButtonClick() {
    if (!this.canAddString()) return;

    this.formArray.push(new FormControl(this.newItem));
    this.newItem = '';
  }
  
  newItemKeydown(event) {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      this.onAddButtonClick();
    }
  }

  onDeleteButtonClick(itemIndex: number) {
    this.formArray.removeAt(itemIndex);
  }

  canAddString() {
    return (
      this.newItem &&
      // Dont add duplicates
      !this.formArray.controls.some((control) => control.value === this.newItem)
    );
  }
}
