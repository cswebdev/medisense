import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    const resolvedData = this.route.snapshot.data['user'];
    if (resolvedData) {
      this.userFirstName = resolvedData.firstName;
      this.userLastName = resolvedData.lastName;
      this.userEmail = resolvedData.email;
    };
  }
}
