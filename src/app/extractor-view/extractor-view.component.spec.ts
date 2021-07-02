import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractorViewComponent } from './extractor-view.component';

describe('ExtractorViewComponent', () => {
  let component: ExtractorViewComponent;
  let fixture: ComponentFixture<ExtractorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractorViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
