import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreServices } from './more-services';

describe('MoreServices', () => {
  let component: MoreServices;
  let fixture: ComponentFixture<MoreServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
