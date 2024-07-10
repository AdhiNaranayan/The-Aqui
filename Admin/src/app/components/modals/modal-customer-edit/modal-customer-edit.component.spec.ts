import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerEditComponent } from './modal-customer-edit.component';

describe('ModalCustomerEditComponent', () => {
  let component: ModalCustomerEditComponent;
  let fixture: ComponentFixture<ModalCustomerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCustomerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
