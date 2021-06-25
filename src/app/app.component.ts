import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Language } from 'sophize-datamodel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  testString = 
`## Title1
$$E=mc^2$$
#wiki/T_asymptotic_cone

#wiki/B_default
`;
  language = Language.Informal;
  control = new FormControl();
}
