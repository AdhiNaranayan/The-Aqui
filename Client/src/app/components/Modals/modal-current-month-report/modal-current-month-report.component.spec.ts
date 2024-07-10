import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCurrentMonthReportComponent } from './modal-current-month-report.component';

describe('ModalCurrentMonthReportComponent', () => {
  let component: ModalCurrentMonthReportComponent;
  let fixture: ComponentFixture<ModalCurrentMonthReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCurrentMonthReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCurrentMonthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
