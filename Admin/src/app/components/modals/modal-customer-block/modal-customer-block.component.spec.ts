import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerBlockComponent } from './modal-customer-block.component';

describe('ModalCustomerBlockComponent', () => {
  let component: ModalCustomerBlockComponent;
  let fixture: ComponentFixture<ModalCustomerBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCustomerBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomerBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
