import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorViewComponent } from './sensor-view.component';
// import { ChartModule } from 'angular2-highcharts';

describe('SensorViewComponent', () => {
  let component: SensorViewComponent;
  let fixture: ComponentFixture<SensorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
