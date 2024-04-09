import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './favorites/favorites.component';
import { DetailsComponent } from './user-details/details.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  {
    path:'favorites',
    component: FavoritesComponent,
    title:'favorites'
  },
  {
    path:'user-details',
    component: DetailsComponent,
    title:'Details'
  },
  {
    path:'my-post',
    component: MyPostsComponent,
    title:'I miei post'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
