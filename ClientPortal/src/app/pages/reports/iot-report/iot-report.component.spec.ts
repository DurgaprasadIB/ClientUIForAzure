import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IotReportComponent } from './iot-report.component';

describe('IotReportComponent', () => {
  let component: IotReportComponent;
  let fixture: ComponentFixture<IotReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
