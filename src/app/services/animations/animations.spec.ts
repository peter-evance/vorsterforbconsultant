import { TestBed } from '@angular/core/testing';

import { Animations } from './animations';

describe('Animations', () => {
  let service: Animations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Animations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
