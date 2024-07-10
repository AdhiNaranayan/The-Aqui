import { TestBed } from '@angular/core/testing';

import { TemporaryRequestService } from './temporary-request.service';

describe('TemporaryRequestService', () => {
  let service: TemporaryRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporaryRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
