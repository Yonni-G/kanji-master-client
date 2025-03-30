import { TestBed } from '@angular/core/testing';

import { KmApiService } from './km-api.service';

describe('KmApiService', () => {
  let service: KmApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
