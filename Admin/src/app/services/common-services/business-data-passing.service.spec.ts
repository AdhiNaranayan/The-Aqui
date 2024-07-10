import { TestBed } from '@angular/core/testing';

import { BusinessDataPassingService } from './business-data-passing.service';

describe('BusinessDataPassingService', () => {
  let service: BusinessDataPassingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessDataPassingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
