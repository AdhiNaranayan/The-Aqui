import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentApproveComponent } from './modal-payment-approve.component';

describe('ModalPaymentApproveComponent', () => {
  let component: ModalPaymentApproveComponent;
  let fixture: ComponentFixture<ModalPaymentApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
