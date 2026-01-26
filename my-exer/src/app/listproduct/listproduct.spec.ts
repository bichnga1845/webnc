import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listproduct } from './listproduct';

describe('Listproduct', () => {
  let component: Listproduct;
  let fixture: ComponentFixture<Listproduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listproduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listproduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
