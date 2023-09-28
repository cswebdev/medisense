import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit{

  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getAll().subscribe((data: User[]) => {
      this.users = data;
    })
  }

}
