import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBookComponent } from './new-book-component';

describe('NewBookComponent', () => {
  let component: NewBookComponent;
  let fixture: ComponentFixture<NewBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBookComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
