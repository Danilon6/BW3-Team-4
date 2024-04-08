import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorDetailsRoutingModule } from './author-details-routing.module';
import { AuthorDetailsComponent } from './author-details.component';


@NgModule({
  declarations: [
    AuthorDetailsComponent
  ],
  imports: [
    CommonModule,
    AuthorDetailsRoutingModule
  ]
})
export class AuthorDetailsModule { }
