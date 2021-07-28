import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LinkBuilderComponent } from './link-builder.component';

describe('LinkBuilderComponent', () => {
  let component: LinkBuilderComponent;
  let fixture: ComponentFixture<LinkBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkBuilderComponent],
      providers: [
        { provide: MatDialogRef, useValue: '' },
        { provide: MAT_DIALOG_DATA, useValue: '' },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
