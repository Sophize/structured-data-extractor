import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceListSelectorComponent } from './resource-list-selector.component';

describe('ResourceListSelectorComponent', () => {
  let component: ResourceListSelectorComponent;
  let fixture: ComponentFixture<ResourceListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceListSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
