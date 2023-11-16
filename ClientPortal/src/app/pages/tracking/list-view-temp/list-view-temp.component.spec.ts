import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewTempComponent } from './list-view-temp.component';

describe('ListViewTempComponent', () => {
  let component: ListViewTempComponent;
  let fixture: ComponentFixture<ListViewTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListViewTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
