import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerWhiteListComponent } from './tracker-white-list.component';

describe('TrackerWhiteListComponent', () => {
  let component: TrackerWhiteListComponent;
  let fixture: ComponentFixture<TrackerWhiteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackerWhiteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackerWhiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
