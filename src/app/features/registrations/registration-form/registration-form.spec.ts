import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { RegistrationForm } from './registration-form';

describe('RegistrationForm', () => {
  let component: RegistrationForm;
  let fixture: ComponentFixture<RegistrationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), provideAnimationsAsync()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
