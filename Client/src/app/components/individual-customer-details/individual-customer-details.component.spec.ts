import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCustomerDetailsComponent } from './individual-customer-details.component';

describe('IndividualCustomerDetailsComponent', () => {
  let component: IndividualCustomerDetailsComponent;
  let fixture: ComponentFixture<IndividualCustomerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualCustomerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
