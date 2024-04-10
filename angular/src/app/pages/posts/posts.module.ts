import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { FormsModule } from '@angular/forms';
import { LeftsideComponent } from '../leftside/leftside.component';
import { RightsideComponent } from '../rightside/rightside.component';


@NgModule({
  declarations: [
    PostsComponent,
    LeftsideComponent,
    RightsideComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    FormsModule
  ]
})
export class PostsModule { }
