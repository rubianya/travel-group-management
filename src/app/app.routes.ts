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

export const routes: Routes = [

    {
        path: '',
        component: AuthLayout,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: Login
            }
        ]
    },

    {
        path: '',
        component: MainLayout,
        children: [
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
        path: '**',
        redirectTo: 'login'
    }

];
