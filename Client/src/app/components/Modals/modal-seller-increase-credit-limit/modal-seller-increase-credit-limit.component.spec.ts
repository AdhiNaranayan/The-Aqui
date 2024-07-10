import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSellerIncreaseCreditLimitComponent } from './modal-seller-increase-credit-limit.component';

describe('ModalSellerIncreaseCreditLimitComponent', () => {
  let component: ModalSellerIncreaseCreditLimitComponent;
  let fixture: ComponentFixture<ModalSellerIncreaseCreditLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSellerIncreaseCreditLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSellerIncreaseCreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
