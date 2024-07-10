import { TestBed } from '@angular/core/testing';

import { PaymentManagementServiceService } from './payment-management-service.service';

describe('PaymentManagementServiceService', () => {
  let service: PaymentManagementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentManagementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
