import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'properties',
    loadComponent: () => import('./components/pages/properties/properties.component').then(m => m.PropertiesComponent)
  },
  {
    path: 'properties/:id',
    loadComponent: () => import('./components/pages/property-details/property-details.component').then(m => m.PropertyDetailsComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'admin', canActivate: [AuthGuard],
    loadComponent: () => import('./components/pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./components/pages/about/about.component').then(m => m.AboutComponent)
  },
  { path: 'error',
    loadComponent: () => import('./components/error-page/error-page.component').then(m => m.ErrorPageComponent)},
  {
    path: '**',
    redirectTo: ''
  }
];