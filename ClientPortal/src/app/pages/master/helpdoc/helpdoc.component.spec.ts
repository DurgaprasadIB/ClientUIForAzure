import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdocComponent } from './helpdoc.component';

describe('HelpdocComponent', () => {
  let component: HelpdocComponent;
  let fixture: ComponentFixture<HelpdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
