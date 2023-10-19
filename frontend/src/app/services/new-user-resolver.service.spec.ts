import { TestBed } from '@angular/core/testing';

import { NewUserResolverService } from './new-user-resolver.service';

describe('NewUserResolverService', () => {
  let service: NewUserResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewUserResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
