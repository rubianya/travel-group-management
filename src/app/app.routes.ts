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
                path: 'trips/:id',
                loadComponent: () => import('./features/trips/trip-form/trip-form').then(m => m.TripForm)
            },
            {
                path: 'trips/:id/detail',
                loadComponent: () => import('./features/trips/trip-detail/trip-detail').then(m => m.TripDetail)
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
                path: 'users',
                loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserList)
            },
            {
                path: 'users/new',
                loadComponent: () => import('./features/users/user-form/user-form').then(m => m.UserForm)
            },
            {
                path: 'users/:id',
                loadComponent: () => import('./features/users/user-form/user-form').then(m => m.UserForm)
            },
            {
                path: 'users/:id/detail',
                loadComponent: () => import('./features/users/user-detail/user-detail').then(m => m.UserDetail)
            },
            {
                path: 'interests',
                loadComponent: () => import('./features/interests/interest-list/interest-list').then(m => m.InterestList)
            },
            {
                path: 'my-registrations',
                loadComponent: () => import('./features/registrations/my-registrations/my-registrations').then(m => m.MyRegistrations)
            },
            {
                path: 'my-group',
                loadComponent: () => import('./features/groups/my-group/my-group').then(m => m.MyGroup)
            }
        ]
    }
];