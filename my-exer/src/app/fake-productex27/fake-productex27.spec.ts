import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeProductex27 } from './fake-productex27';

describe('FakeProductex27', () => {
  let component: FakeProductex27;
  let fixture: ComponentFixture<FakeProductex27>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FakeProductex27]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeProductex27);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
