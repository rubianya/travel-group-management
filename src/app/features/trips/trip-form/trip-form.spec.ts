import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { TripForm } from './trip-form';

describe('TripForm', () => {
  let component: TripForm;
  let fixture: ComponentFixture<TripForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), provideAnimationsAsync()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
