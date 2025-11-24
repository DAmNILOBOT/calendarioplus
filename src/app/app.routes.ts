import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage) },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: 'calendar', loadComponent: () => import('./pages/calendar/calendar.page').then(m => m.CalendarPage) },
  { path: 'events', loadComponent: () => import('./pages/events/events.page').then(m => m.EventsPage) },
  { path: 'events/new', loadComponent: () => import('./pages/events/new-event/new-event.page').then(m => m.NewEventPage) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage) },
  { path: '**', redirectTo: '' }
];
