import { TestBed } from '@angular/core/testing';

import { MytasksResolverService } from './mytasks-resolver.service';

describe('MytasksResolverService', () => {
  let service: MytasksResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MytasksResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
