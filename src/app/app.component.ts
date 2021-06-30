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

#wiki/B_default

#metamath/P_2p2e4
`;
  language = Language.Informal;
  control = new FormControl();
}
