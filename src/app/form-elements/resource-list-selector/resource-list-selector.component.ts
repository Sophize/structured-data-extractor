import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  PropositionPointer,
  ResourcePointer,
  ResourceType,
} from 'sophize-datamodel';

@Component({
  selector: 'app-resource-list-selector',
  templateUrl: './resource-list-selector.component.html',
  styleUrls: ['./resource-list-selector.component.scss'],
})
export class ResourceListSelectorComponent implements OnInit {
  readonly ResourceType = ResourceType;

  @Input()
  formSingleResource: FormControl;

  @Input()
  formResourceIds: FormArray = new FormArray([]);

  @Input()
  placeholder: string;

  @Input()
  resourceType = null;

  @Input()
  needsPropositionPointer = false;

  @Input()
  editingFrozen = false;

  @Input()
  singleResource = false;

  @Input()
  context: ResourcePointer;

  inputPropPositive = true;
  inputTextControl: FormControl;
  maxDisplayedResources = 25;

  ngOnInit() {
    this.inputTextControl = new FormControl('');
    if (this.singleResource) this.configureAutoAddForSingleResource();
  }

  configureAutoAddForSingleResource() {
    const existingInput = this.formSingleResource.value;
    let intitialValue = '';
    if (existingInput instanceof ResourcePointer) {
      intitialValue = existingInput.toString();
    } else if (existingInput instanceof PropositionPointer) {
      intitialValue = existingInput.ptr.toString();
      this.inputPropPositive = !existingInput.negative;
    } else {
      intitialValue = existingInput;
    }
    this.inputTextControl.setValue(intitialValue);

    this.inputTextControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((_) => this.onAddButtonClick());
  }

  onAddButtonClick() {
    if (!this.canAddResourceId()) return;
    const newResourceId = this.getResourceId();
    if (this.singleResource) {
      this.formSingleResource.setValue(newResourceId);
    } else {
      this.formResourceIds.push(new FormControl(newResourceId));
      this.inputTextControl.setValue('');
    }
  }

  onToggleClick() {
    if (this.singleResource) this.onAddButtonClick();
  }

  doesAlreadyExist(resource) {
    let equalityFun = null;
    if (this.needsPropositionPointer) {
      equalityFun = (control) =>
        PropositionPointer.equals(control.value, resource);
    } else {
      equalityFun = (control) =>
        (<ResourcePointer>control.value).equals(resource);
    }
    if (!equalityFun) return true;

    if (this.singleResource) {
      if (!this.formSingleResource.value) return false;
      return [this.formSingleResource].some(equalityFun);
    }
    return this.formResourceIds.controls.some(equalityFun);
  }

  getResourceId() {
    let inputString: string = this.inputTextControl.value;
    const defaultDatasetId = this.context ? this.context.datasetId : null;

    if (this.needsPropositionPointer) {
      return PropositionPointer.fromString(inputString, defaultDatasetId);
    }
    const resourcePtr = ResourcePointer.fromString(
      inputString,
      defaultDatasetId
    );
    return resourcePtr?.resourceType === this.resourceType ? resourcePtr : null;
  }

  onDeleteButtonClick(itemIndex: number) {
    if (this.singleResource) return;
    this.formResourceIds.removeAt(itemIndex);
  }

  canAddResourceId() {
    const resourceId = this.getResourceId();
    return resourceId && !this.doesAlreadyExist(resourceId);
  }

  showMore() {
    this.maxDisplayedResources += 25;
  }

  canViewMore() {
    return this.formResourceIds.controls.length > this.numDisplayedResources;
  }

  get inputTextResourceType() {
    if (!this.inputTextControl.value) return ResourceType.UNKNOWN;
    const resourcePtr = ResourcePointer.fromString(this.inputTextControl.value);
    if (!resourcePtr) return ResourceType.UNKNOWN;
    return resourcePtr.resourceType;
  }

  get hasValidValues() {
    if (this.singleResource) {
      return !!this.formSingleResource.value;
    } else {
      return this.formResourceIds.controls.length > 0;
    }
  }

  get numDisplayedResources() {
    return this.maxDisplayedResources;
  }
}
