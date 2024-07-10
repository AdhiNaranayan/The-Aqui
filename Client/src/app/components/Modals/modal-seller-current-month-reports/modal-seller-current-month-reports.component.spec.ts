import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSellerCurrentMonthReportsComponent } from './modal-seller-current-month-reports.component';

describe('ModalSellerCurrentMonthReportsComponent', () => {
  let component: ModalSellerCurrentMonthReportsComponent;
  let fixture: ComponentFixture<ModalSellerCurrentMonthReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSellerCurrentMonthReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSellerCurrentMonthReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
