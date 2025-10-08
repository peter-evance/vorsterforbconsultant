import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOffice } from './contact-office';

describe('ContactOffice', () => {
  let component: ContactOffice;
  let fixture: ComponentFixture<ContactOffice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactOffice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactOffice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
