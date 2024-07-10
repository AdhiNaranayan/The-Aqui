import { TestBed } from '@angular/core/testing';

import { HundiScoreService } from './hundi-score.service';

describe('HundiScoreService', () => {
  let service: HundiScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HundiScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
