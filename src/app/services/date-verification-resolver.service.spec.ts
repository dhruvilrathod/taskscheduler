import { TestBed } from '@angular/core/testing';

import { DateVerificationResolverService } from './date-verification-resolver.service';

describe('DateVerificationResolverService', () => {
  let service: DateVerificationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateVerificationResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
