import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessBranchInvoiceComponent } from './business-branch-invoice.component';

describe('BusinessBranchInvoiceComponent', () => {
  let component: BusinessBranchInvoiceComponent;
  let fixture: ComponentFixture<BusinessBranchInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessBranchInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessBranchInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
