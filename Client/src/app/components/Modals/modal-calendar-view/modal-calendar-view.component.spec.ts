import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCalendarViewComponent } from './modal-calendar-view.component';

describe('ModalCalendarViewComponent', () => {
  let component: ModalCalendarViewComponent;
  let fixture: ComponentFixture<ModalCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
