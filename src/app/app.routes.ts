import { AuthGuard } from './core/guards/auth-guard';
import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { TripList } from './features/trips/trip-list/trip-list';
import { TripForm } from './features/trips/trip-form/trip-form';
import { RegistrationList } from './features/registrations/registration-list/registration-list';
import { GroupList } from './features/groups/group-list/group-list';
import { ItineraryList } from './features/itinerary/itinerary-list/itinerary-list';
import { RegistrationForm } from './features/registrations/registration-form/registration-form';


export const routes: Routes = [
    
    {
        path: '',
        component: MainLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'trips',
                component: TripList
            },
            {
                path: 'trips/new',
                component: TripForm
            },
            {
                path: 'registrations',
                component: RegistrationList
            },
            {
                path: 'registrations/new',
                component: RegistrationForm
            },
            {
                path: 'groups',
                component: GroupList
            },
            {
                path: 'itinerary',
                component: ItineraryList
            }
        ]
    },

    {
        path: '',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                component: Login
            }
        ]
    },
    
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];