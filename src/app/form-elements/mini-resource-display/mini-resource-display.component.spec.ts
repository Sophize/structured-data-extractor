import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniResourceDisplayComponent } from './mini-resource-display.component';

describe('MiniResourceDisplayComponent', () => {
  let component: MiniResourceDisplayComponent;
  let fixture: ComponentFixture<MiniResourceDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniResourceDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniResourceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
