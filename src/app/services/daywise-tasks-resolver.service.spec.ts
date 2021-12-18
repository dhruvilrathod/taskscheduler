import { TestBed } from '@angular/core/testing';

import { DaywiseTasksResolverService } from './daywise-tasks-resolver.service';

describe('DaywiseTasksResolverService', () => {
  let service: DaywiseTasksResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaywiseTasksResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
