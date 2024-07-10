import { TestBed } from '@angular/core/testing';

import { BusinessManagementService } from './business-management.service';

describe('BusinessManagementService', () => {
  let service: BusinessManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
