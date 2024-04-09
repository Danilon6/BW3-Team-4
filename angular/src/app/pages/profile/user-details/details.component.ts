import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { iUser } from '../../../models/i-user';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {


  user: iUser | undefined;

  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.authSvc.$user.subscribe((user) => {
      this.user = user || undefined;
    });
  }
}
