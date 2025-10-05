import { TestBed } from '@angular/core/testing';

import { Ipservice } from './ipservice';

describe('Ipservice', () => {
  let service: Ipservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ipservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
