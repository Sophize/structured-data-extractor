import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Language } from 'sophize-datamodel';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
  readonly Language = Language;
  readonly LANGUAGE_TO_NAME = new Map<Language, string>([
    [Language.Informal, 'Informal'],
    [Language.MetamathSetMm, 'Metamath set'],
  ]);

  @Input()
  control: FormControl;
}
