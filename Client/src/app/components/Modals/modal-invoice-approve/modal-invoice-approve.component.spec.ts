import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInvoiceApproveComponent } from './modal-invoice-approve.component';

describe('ModalInvoiceApproveComponent', () => {
  let component: ModalInvoiceApproveComponent;
  let fixture: ComponentFixture<ModalInvoiceApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInvoiceApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInvoiceApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
