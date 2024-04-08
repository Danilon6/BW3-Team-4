import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { DetailsComponent } from './user-details/details.component';
import { FavoritesComponent } from './favorites/favorites.component';


@NgModule({
  declarations: [
    ProfileComponent,
    DetailsComponent,
    FavoritesComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
