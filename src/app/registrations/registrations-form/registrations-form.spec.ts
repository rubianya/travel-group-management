import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationsForm } from './registrations-form';

describe('RegistrationsForm', () => {
  let component: RegistrationsForm;
  let fixture: ComponentFixture<RegistrationsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationsForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
