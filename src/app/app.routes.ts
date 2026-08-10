import { AuthGuard } from './core/guards/auth-guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: '',
        loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'trips',
                loadComponent: () => import('./features/trips/trip-list/trip-list').then(m => m.TripList)
            },
            {
                path: 'trips/new',
                loadComponent: () => import('./features/trips/trip-form/trip-form').then(m => m.TripForm)
            },
            {
                path: 'registrations',
                loadComponent: () => import('./features/registrations/registration-list/registration-list').then(m => m.RegistrationList)
            },
            {
                path: 'registrations/new',
                loadComponent: () => import('./features/registrations/registration-form/registration-form').then(m => m.RegistrationForm)
            },
            {
                path: 'groups',
                loadComponent: () => import('./features/groups/group-list/group-list').then(m => m.GroupList)
            },
            {
                path: 'itinerary',
                loadComponent: () => import('./features/itinerary/itinerary-list/itinerary-list').then(m => m.ItineraryList)
            }
        ]
    }
];