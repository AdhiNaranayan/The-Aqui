import { TestBed } from '@angular/core/testing';

import { BranchDataPassingService } from './branch-data-passing.service';

describe('BranchDataPassingService', () => {
  let service: BranchDataPassingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchDataPassingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
