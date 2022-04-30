import { TestBed } from '@angular/core/testing';

import { ApproutesGuard } from './approutes.guard';

describe('ApproutesGuard', () => {
  let guard: ApproutesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ApproutesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
