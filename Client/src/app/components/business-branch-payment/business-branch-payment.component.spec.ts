import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessBranchPaymentComponent } from './business-branch-payment.component';

describe('BusinessBranchPaymentComponent', () => {
  let component: BusinessBranchPaymentComponent;
  let fixture: ComponentFixture<BusinessBranchPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessBranchPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessBranchPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
