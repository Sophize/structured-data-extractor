import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringListSelectorComponent } from './string-list-selector.component';

describe('StringListSelectorComponent', () => {
  let component: StringListSelectorComponent;
  let fixture: ComponentFixture<StringListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringListSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
