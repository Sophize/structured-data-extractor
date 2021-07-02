import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceListPanelComponent } from './resource-list-panel.component';

describe('ResourceListPanelComponent', () => {
  let component: ResourceListPanelComponent;
  let fixture: ComponentFixture<ResourceListPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceListPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
