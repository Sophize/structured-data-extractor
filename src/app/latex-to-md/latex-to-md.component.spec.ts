import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatexToMdComponent } from './latex-to-md.component';

describe('LatexToMdComponent', () => {
  let component: LatexToMdComponent;
  let fixture: ComponentFixture<LatexToMdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatexToMdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatexToMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
