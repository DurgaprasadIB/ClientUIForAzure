import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivechartsComponent } from './livecharts.component';

describe('LivechartsComponent', () => {
  let component: LivechartsComponent;
  let fixture: ComponentFixture<LivechartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivechartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivechartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
