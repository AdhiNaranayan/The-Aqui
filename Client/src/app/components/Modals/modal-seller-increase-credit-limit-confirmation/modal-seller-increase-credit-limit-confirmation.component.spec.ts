import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSellerIncreaseCreditLimitConfirmationComponent } from './modal-seller-increase-credit-limit-confirmation.component';

describe('ModalSellerIncreaseCreditLimitConfirmationComponent', () => {
  let component: ModalSellerIncreaseCreditLimitConfirmationComponent;
  let fixture: ComponentFixture<ModalSellerIncreaseCreditLimitConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSellerIncreaseCreditLimitConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSellerIncreaseCreditLimitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
