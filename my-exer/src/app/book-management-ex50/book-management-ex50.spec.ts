import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookManagementEx50 } from './book-management-ex50';

describe('BookManagementEx50', () => {
  let component: BookManagementEx50;
  let fixture: ComponentFixture<BookManagementEx50>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookManagementEx50]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookManagementEx50);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
