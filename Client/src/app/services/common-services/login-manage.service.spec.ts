import { TestBed } from '@angular/core/testing';

import { LoginManageService } from './login-manage.service';

describe('LoginManageService', () => {
  let service: LoginManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
