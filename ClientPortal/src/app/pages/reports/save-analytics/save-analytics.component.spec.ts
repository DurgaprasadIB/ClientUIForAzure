import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAnalyticsComponent } from './save-analytics.component';

describe('SaveAnalyticsComponent', () => {
  let component: SaveAnalyticsComponent;
  let fixture: ComponentFixture<SaveAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
