import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesManagementComponent } from './rules-management.component';

describe('RulesManagementComponent', () => {
  let component: RulesManagementComponent;
  let fixture: ComponentFixture<RulesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
