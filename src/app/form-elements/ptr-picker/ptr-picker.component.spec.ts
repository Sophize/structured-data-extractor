import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtrPickerComponent } from './ptr-picker.component';

describe('PtrPickerComponent', () => {
  let component: PtrPickerComponent;
  let fixture: ComponentFixture<PtrPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtrPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PtrPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
