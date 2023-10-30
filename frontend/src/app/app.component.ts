import { Component, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {

  private authSubscription!: Subscription;


  constructor(private authService: AuthService, 
    private modalService: NgbModal) {
}


ngOnInit() {
  this.authSubscription = this.authService.isAuthenticated().subscribe((user) => {
    if (user) {
      // Perform any actions you need when the user is logged in
      // this.router.navigate(['/patient-portal']); // Redirect to dashboard or any other route you want
    } else {
      // Perform any actions you need when the user is logged out
      // this.router.navigate(['/login']); // Redirect to login or any other route you want
    }
  });
}


  ngOnDestroy() {
    // Unsubscribe from the authState subscription when the component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }
}