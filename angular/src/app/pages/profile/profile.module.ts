import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { DetailsComponent } from './user-details/details.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    DetailsComponent,
    FavoritesComponent,
    MyPostsComponent,


  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule
  ]
})
export class ProfileModule { }
