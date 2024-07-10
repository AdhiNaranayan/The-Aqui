import { TestBed } from '@angular/core/testing';

import { InviteManagementService } from './invite-management.service';

describe('InviteManagementService', () => {
  let service: InviteManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InviteManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
