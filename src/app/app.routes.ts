import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/wanted-list',
    pathMatch: 'full'
  },
  {
    path: 'wanted-list',
    loadComponent: () => import('./shared/presentation/views/wanted-list/wanted-list').then(m => m.WantedList)
  },
  {
    path: '**',
    redirectTo: '/wanted-list'
  }
];
