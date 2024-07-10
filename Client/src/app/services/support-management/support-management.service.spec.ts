import { TestBed } from '@angular/core/testing';

import { SupportManagementService } from './support-management.service';

describe('SupportManagementService', () => {
  let service: SupportManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
