import { TestBed } from '@angular/core/testing';

import { UserDataPassingService } from './user-data-passing.service';

describe('UserDataPassingService', () => {
  let service: UserDataPassingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDataPassingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
