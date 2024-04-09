import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './favorites/favorites.component';
import { DetailsComponent } from './user-details/details.component';
import { MyPostsComponent } from './my-posts/my-posts.component';

const routes: Routes = [
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
