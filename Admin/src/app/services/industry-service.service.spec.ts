import { TestBed } from '@angular/core/testing';

import { IndustryServiceService } from './industry-service.service';

describe('IndustryServiceService', () => {
  let service: IndustryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndustryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
