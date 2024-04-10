import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { GuestGuard } from './auth/guest.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
  },
  {
    path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
    title:'Profile',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    },
  {
    path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    title:'Home',
    canActivate: [GuestGuard]
    },
  {
    path: 'author-details', loadChildren: () => import('./pages/author-details/author-details.module').then(m => m.AuthorDetailsModule),
    title:'Author Details',
    canActivate: [AuthGuard]
    },
  {
    path: 'posts', loadChildren: () => import('./pages/posts/posts.module').then(m => m.PostsModule),
    title:'posts',
    canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
