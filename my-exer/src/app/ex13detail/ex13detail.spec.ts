import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex13detail } from './ex13detail';

describe('Ex13detail', () => {
  let component: Ex13detail;
  let fixture: ComponentFixture<Ex13detail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Ex13detail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ex13detail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
