import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PtrPickerComponent } from './ptr-picker.component';

describe('PtrPickerComponent', () => {
  let component: PtrPickerComponent;
  let fixture: ComponentFixture<PtrPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtrPickerComponent ],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: '' },
        { provide: MAT_DIALOG_DATA, useValue: '' },
      ],
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
