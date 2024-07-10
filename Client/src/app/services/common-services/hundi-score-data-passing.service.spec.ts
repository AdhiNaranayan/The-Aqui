import { TestBed } from '@angular/core/testing';

import { HundiScoreDataPassingService } from './hundi-score-data-passing.service';

describe('HundiScoreDataPassingService', () => {
  let service: HundiScoreDataPassingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HundiScoreDataPassingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
