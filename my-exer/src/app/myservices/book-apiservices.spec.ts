import { TestBed } from '@angular/core/testing';

import { BookAPIservices } from './book-apiservices';

describe('BookAPIservices', () => {
  let service: BookAPIservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookAPIservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
