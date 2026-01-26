import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex28 } from './ex28';

describe('Ex28', () => {
  let component: Ex28;
  let fixture: ComponentFixture<Ex28>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Ex28]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ex28);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
