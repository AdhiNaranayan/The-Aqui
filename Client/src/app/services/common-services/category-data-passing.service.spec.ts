import { TestBed } from '@angular/core/testing';

import { CategoryDataPassingService } from './category-data-passing.service';

describe('CategoryDataPassingService', () => {
  let service: CategoryDataPassingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryDataPassingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
