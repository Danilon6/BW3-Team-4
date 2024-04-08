import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { DetailsComponent } from './user-details/details.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
