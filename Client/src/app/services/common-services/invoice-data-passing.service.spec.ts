import { TestBed } from '@angular/core/testing';

import { InvoiceDataPassingService } from './invoice-data-passing.service';

describe('InvoiceDataPassingService', () => {
  let service: InvoiceDataPassingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceDataPassingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
