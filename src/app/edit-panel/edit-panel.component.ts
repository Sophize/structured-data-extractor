import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import {
  Argument,
  Article,
  Language,
  Proposition,
  PropositionPointer,
  Resource,
  ResourcePointer,
  ResourceType,
  Term,
} from 'sophize-datamodel';
import { getLinkedMdText } from '../form-elements/link-builder/link-builder.component';
import { getPtrUsingDialog } from '../form-elements/ptr-picker/ptr-picker.component';
import { WorkspaceService } from '../workspace.service';
import {
  getSelectionInfo,
  replaceSelectedFieldValue,
  SelectionInfo,
} from './selection-utils';

export enum State {
  IDLE,
  LOAD,
  SAVE,
  RESET,
}

export async function save(
  ptr: ResourcePointer,
  workspace: WorkspaceService,
  stateUpdater: (arg0: State) => void,
  snackBar?: MatSnackBar
) {
  if (!ptr) return;
  try {
    stateUpdater(State.SAVE);
    await lastValueFrom(workspace.save(ptr));
    if (snackBar) {
      snackBar.open('Saved ' + ptr.toDisplayString(), 'Dismiss', {
        duration: 5000,
      });
    }
  } catch (e) {
    alert('save failed: ' + e);
  } finally {
    stateUpdater(State.IDLE);
  }
}

function setFormArray(formArray: FormArray, values: any[]) {
  formArray.clear();
  (values || []).forEach((value) => formArray.push(new FormControl(value)));
}

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss'],
})
export class EditPanelComponent implements OnInit {
  ResourceType = ResourceType;
  TERM = ResourceType.TERM;
  PROPOSITION = ResourceType.PROPOSITION;
  ARGUMENT = ResourceType.ARGUMENT;
  ARTICLE = ResourceType.ARTICLE;
  Language = Language;

  ptr: ResourcePointer = null;
  resource = null as Resource;
  state = State.IDLE;

  form = null as FormGroup;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  selectionInfo: SelectionInfo = null;

  constructor(
    private fb: FormBuilder,
    private workspace: WorkspaceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.workspace.selectedPtr$.subscribe((ptr) => {
      this.ptr = ptr;
      this.refetch();
    });

    this.form = this.fb.group({
      phrase: '', // T
      language: Language.Informal, // TPA
      primitive: false, // T
      definition: '', // T
      statement: '', // P
      negativeStatement: '', // P
      remarks: '', // TP
      lookupTerms: this.fb.array([]), // TPA
      alternatePhrases: this.fb.array([]), // T

      conclusion: new PropositionPointer(new ResourcePointer(), null), // A
      // premiseMachine: new ResourcePointer(), // A
      premises: this.fb.array([]), // A
      argumentText: '', // A

      title: '', // R
      beliefset: new ResourcePointer(), // R
      abstractText: '', // R
      content: '', // R

      // Common for resources
      names: this.fb.array([]), // Not term
      // indexable: false,
      citations: this.fb.array([]),
      tags: this.fb.array([]),
    });
    this.form.valueChanges.subscribe((_) => {
      console.log('changed');
      this.workspace.updateLoaded(this.ptr, this.resourceFromForm());
    });
  }

  resourceFromForm() {
    const common = {
      names: this.namesFormArray.controls.map((c) => c.value),
      citations: this.citationsFormArray.controls.map((c) => {
        return { textCitation: c.value };
      }),
      tags: this.tagsFormArray.controls.map((c) => c.value),
      assignablePtr: this.ptr.toString(),
    };
    switch (this.ptr.resourceType) {
      case ResourceType.TERM:
        return {
          phrase: this.phraseControl.value,
          definition: this.definitionControl.value,
          primitive: this.primitiveControl.value,
          language: this.languageControl.value,
          remarks: this.remarksControl.value,
          alternatePhrases: this.alternatePhrasesFormArray.controls.map(
            (c) => c.value
          ),
          lookupTerms: this.lookupTermsFormArray.controls.map((c) =>
            c.value.toString()
          ),
          ...common,
        } as Term;
      case ResourceType.PROPOSITION:
        return {
          statement: this.statementControl.value,
          negativeStatement: this.definitionControl.value,
          language: this.languageControl.value,
          remarks: this.remarksControl.value,
          lookupTerms: this.lookupTermsFormArray.controls.map((c) =>
            c.value.toString()
          ),
          ...common,
        } as Proposition;
      case ResourceType.ARGUMENT:
        return {
          language: this.languageControl.value,
          argumentText: this.argumentTextControl.value,
          conclusion: this.conclusionControl.value.toString(),
          premises: this.premisesFormArray.controls.map((c) =>
            c.value.toString()
          ),
          lookupTerms: this.lookupTermsFormArray.controls.map((c) =>
            c.value.toString()
          ),
          ...common,
        } as Argument;
      case ResourceType.ARTICLE:
        return {
          title: this.titleControl.value,
          beliefset: this.beliefsetControl.value,
          abstractText: this.abstractTextControl.value,
          content: this.contentControl.value,
          ...common,
        } as Article;
    }
    return null;
  }

  refetch() {
    this.resource = this.workspace.getLoadedResource(this.ptr)?.updated;
    if (this.resource) {
      switch (this.ptr.resourceType) {
        case ResourceType.TERM:
          const term = this.resource as Term;
          this.phraseControl.setValue(term.phrase);
          setFormArray(this.alternatePhrasesFormArray, term?.alternatePhrases);
          this.definitionControl.setValue(term.definition);
          this.languageControl.setValue(term.language);
          this.primitiveControl.setValue(term.primitive);
          this.remarksControl.setValue(term.remarks);
          setFormArray(
            this.lookupTermsFormArray,
            this.stringToPtrArray(term?.lookupTerms)
          );
          break;

        case ResourceType.PROPOSITION:
          const proposition = this.resource as Proposition;
          this.statementControl.setValue(proposition.statement);
          this.negativeStatementControl.setValue(proposition.negativeStatement);
          this.languageControl.setValue(proposition.language);
          this.remarksControl.setValue(proposition.remarks);
          setFormArray(
            this.lookupTermsFormArray,
            this.stringToPtrArray(term?.lookupTerms)
          );
          break;

        case ResourceType.ARGUMENT:
          const argument = this.resource as Argument;
          this.argumentTextControl.setValue(argument.argumentText);
          this.languageControl.setValue(argument.language);
          this.conclusionControl.setValue(
            this.stringToPropPtr(argument.conclusion)
          );
          setFormArray(
            this.premisesFormArray,
            this.stringToPropPtrArray(argument?.premises)
          );
          setFormArray(
            this.lookupTermsFormArray,
            this.stringToPtrArray(term?.lookupTerms)
          );
          break;
        case ResourceType.ARTICLE:
          const article = this.resource as Article;
          this.titleControl.setValue(article.title);
          this.abstractTextControl.setValue(article.abstractText);
          this.contentControl.setValue(article.content);
          this.beliefsetControl.setValue(this.stringToPtr(article.beliefset));
          break;
      }
      setFormArray(this.tagsFormArray, this.resource.tags);
      setFormArray(
        this.citationsFormArray,
        this.resource.citations?.map((citation) => citation.textCitation) || []
      );
      setFormArray(this.namesFormArray, this.resource.names);
    }
  }

  stringToPtrArray(arr: string[]) {
    return ResourcePointer.fromStringArr(arr || [], this.ptr.datasetId);
  }

  stringToPtr(str: string) {
    return ResourcePointer.fromString(str, this.ptr.datasetId);
  }

  stringToPropPtrArray(arr: string[]) {
    return PropositionPointer.fromStringArr(arr || [], this.ptr.datasetId);
  }

  stringToPropPtr(str: string) {
    return PropositionPointer.fromString(str, this.ptr.datasetId);
  }

  ptrArrayToString(arr: ResourcePointer[]) {
    return (arr || []).map((ptr) => this.ptrToString(ptr));
  }

  ptrToString(ptr: ResourcePointer) {
    return ptr.toString(this.ptr.datasetId);
  }

  propPtrArrayToString(arr: PropositionPointer[]) {
    return (arr || []).map((ptr) => this.propPtrToString(ptr));
  }

  propPtrToString(ptr: PropositionPointer) {
    return ptr.toString(this.ptr.datasetId);
  }

  async save() {
    await save(
      this.ptr,
      this.workspace,
      (state) => (this.state = state),
      this.snackBar
    );
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
      alert(e);
      return false;
    }
    if (!unloaded) {
      const discard = confirm(
        'There may be unsaved changes. Are you sure you want to discard them?'
      );
      if (discard) unloaded = this.workspace.unload(this.ptr, true);
    }
    if (unloaded) this.workspace.selectedPtr$.next(null);
    return unloaded;
  }

  get phraseControl() {
    return this.form.get('phrase') as FormControl;
  }

  get alternatePhrasesFormArray() {
    return this.form.get('alternatePhrases') as FormArray;
  }

  get definitionControl() {
    return this.form.get('definition') as FormControl;
  }

  get statementControl() {
    return this.form.get('statement') as FormControl;
  }

  get negativeStatementControl() {
    return this.form.get('negativeStatement') as FormControl;
  }

  get remarksControl() {
    return this.form.get('remarks') as FormControl;
  }

  get primitiveControl() {
    return this.form.get('primitive') as FormControl;
  }

  get languageControl() {
    return this.form.get('language') as FormControl;
  }

  get conclusionControl() {
    return this.form.get('conclusion') as FormControl;
  }

  get premisesFormArray() {
    return this.form.get('premises') as FormArray;
  }

  get argumentTextControl() {
    return this.form.get('argumentText') as FormControl;
  }

  get lookupTermsFormArray() {
    return this.form.get('lookupTerms') as FormArray;
  }

  get tagsFormArray() {
    return this.form.get('tags') as FormArray;
  }

  get namesFormArray() {
    return this.form.get('names') as FormArray;
  }

  get citationsFormArray() {
    return this.form.get('citations') as FormArray;
  }

  get titleControl() {
    return this.form.get('title') as FormControl;
  }

  get abstractTextControl() {
    return this.form.get('abstractText') as FormControl;
  }

  get contentControl() {
    return this.form.get('content') as FormControl;
  }

  get beliefsetControl() {
    return this.form.get('beliefset') as FormControl;
  }

  onRightClick(event: MouseEvent) {
    this.selectionInfo = getSelectionInfo();
    if (!this.selectionInfo) return true;

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.trigger.openMenu();
    return false;
  }

  async addLink() {
    if (!this.selectionInfo) return;
    // Selection often causes unnecessary space on the right.
    const selectedText = this.selectionInfo.selectionText.replace(/\s+$/, '');
    const contextPtr = this.workspace.selectedPtr$.value;
    const linkedMdText = await lastValueFrom(
      getLinkedMdText(this.dialog, selectedText, contextPtr)
    );
    if (!linkedMdText) return;
    const formControl = this.form.get(
      this.selectionInfo.fieldName
    ) as FormControl;
    replaceSelectedFieldValue(linkedMdText, this.selectionInfo, formControl);
  }

  async extractResource(type: ResourceType) {
    if (!this.selectionInfo) return;
    const samplePtr = ResourcePointer.fromString('test/T_new');
    samplePtr.resourceType = type;
    const pickerOutput = await lastValueFrom(
      getPtrUsingDialog(this.dialog, samplePtr, true)
    );
    const newPtr = pickerOutput.ptr;
    if (!newPtr) return;

    const selectionText = this.selectionInfo?.selectionText.replace(/\s+$/, '');
    let resource;
    if (type === ResourceType.TERM) {
      resource = { definition: selectionText } as Term;
    } else if (type === ResourceType.PROPOSITION) {
      resource = { statement: selectionText } as Proposition;
    } else if (type === ResourceType.ARGUMENT) {
      resource = { argumentText: selectionText } as Argument;
    } else if (type === ResourceType.ARTICLE) {
      resource = { content: selectionText } as Article;
    } else {
      resource = {};
    }
    this.workspace.createNew(newPtr, resource);

    if (pickerOutput.shouldReplace) {
      const formControl = this.form.get(
        this.selectionInfo.fieldName
      ) as FormControl;
      const newValue = `#${newPtr.toDisplayString(this.ptr.datasetId)}|EXPAND`;
      replaceSelectedFieldValue(newValue, this.selectionInfo, formControl);
    }

    this.workspace.selectedPtr$.next(newPtr);
  }
}
