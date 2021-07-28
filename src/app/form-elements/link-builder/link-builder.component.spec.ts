import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkBuilderComponent } from './link-builder.component';

describe('LinkBuilderComponent', () => {
  let component: LinkBuilderComponent;
  let fixture: ComponentFixture<LinkBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkBuilderComponent ]
    })
    .compileComponents();
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
