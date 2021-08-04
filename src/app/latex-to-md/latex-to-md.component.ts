import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-latex-to-md',
  templateUrl: './latex-to-md.component.html',
  styleUrls: ['./latex-to-md.component.scss'],
})
export class LatexToMdComponent {
  inputLatex = '';
  
  // https://github.com/Sophize/md-convert-server
  serverAddress = 'https://md-convert-cloud-run-jouxmxqhuq-uc.a.run.app/';
  output = '';
  converting = false;
  control = new FormControl();

  constructor(private http: HttpClient) {
    this.inputLatex = `\\documentclass[12pt]{article}
\\begin{document}
Hello world,
$E = mc^2!$ %math mode 
\\end{document}`;
  }

  convert() {
    this.converting = true;
    this.http
      .post(this.serverAddress + '/api/to_md', { latex: this.inputLatex })
      .subscribe(
        (response) => {
          this.converting = false;
          this.control.setValue(response['v']);
        },
        (err) => {
          this.converting = false;
          this.control.setValue(`Conversion failure: ${err.toString()}`);
        }
      );
  }
}
