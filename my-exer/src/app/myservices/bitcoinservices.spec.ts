import { TestBed } from '@angular/core/testing';

import { Bitcoinservices } from './bitcoinservices';

describe('Bitcoinservices', () => {
  let service: Bitcoinservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bitcoinservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
