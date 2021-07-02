import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Language } from 'sophize-datamodel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  testString = `## Markdown Renderer Test
  This is a sentence with inline $\\LaTeX$ in it. Next, we have einstein's equation in block mode.

  $$E=mc^2$$
  
  Below are references to some resources. Make sure you have the right server configuration to view them.

  #wiki/T_asymptotic_cone
  
  #metamath/P_2p2e4|EXPAND
  `;
  language = Language.Informal;
  control = new FormControl();
}
