import { TestBed } from '@angular/core/testing';

import { OwnerRegisterService } from './owner-register.service';

describe('OwnerRegisterService', () => {
  let service: OwnerRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
