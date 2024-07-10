import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInvoiceAcceptComponent } from './modal-invoice-accept.component';

describe('ModalInvoiceAcceptComponent', () => {
  let component: ModalInvoiceAcceptComponent;
  let fixture: ComponentFixture<ModalInvoiceAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInvoiceAcceptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInvoiceAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
