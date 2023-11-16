import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPinsComponent } from './dashboard-pins.component';

describe('DashboardPinsComponent', () => {
  let component: DashboardPinsComponent;
  let fixture: ComponentFixture<DashboardPinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
