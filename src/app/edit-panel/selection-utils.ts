import { FormControl } from '@angular/forms';

export interface SelectionInfo {
  fieldName: string;
  selectionText: string;
  startIndex: number;
  endIndex: number;
}

export function getSelectionInfo(): SelectionInfo {
  const selection = window.getSelection();
  const fieldNames = [
    'phrase',
    'definition',
    'statement',
    'negativeStatement',
    'remarks',
    'argumentText',
    'abstractText',
    'content',
  ];
  const commonAncestor = selection.getRangeAt(0).commonAncestorContainer;
  let el = commonAncestor;
  while (el) {
    const htmlEL = el as HTMLElement;
    if (!htmlEL || !htmlEL.getAttribute) return null;
    const name = htmlEL.getAttribute('name');
    if (fieldNames.includes(name)) {
      const textArea = el.childNodes?.[0]?.childNodes?.[0];
      if (textArea?.nodeName === 'TEXTAREA') {
        const selectionText = selection.toString();
        const startIndex = (textArea as HTMLInputElement).selectionStart;
        const endIndex = (textArea as HTMLInputElement).selectionEnd;
        return { fieldName: name, selectionText, startIndex, endIndex };
      }
    }
    el = el.parentElement;
  }
  return null;
}

export function replaceSelectedFieldValue(
  newText: String,
  selectionInfo: SelectionInfo,
  formControl: FormControl
) {
  const selectionText = selectionInfo.selectionText.replace(/\s+$/, '');
  const removedChars =
    selectionInfo.selectionText.length - selectionText.length;
  const prevValue: string = formControl.value;
  const updatedValue =
    prevValue.substring(0, selectionInfo.startIndex) +
    newText +
    prevValue.substr(selectionInfo.endIndex - removedChars);
  formControl.setValue(updatedValue);
}
