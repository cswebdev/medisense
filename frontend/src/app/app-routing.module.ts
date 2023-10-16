import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { PatientPortalComponent } from './patient-portal/patient-portal.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserlistComponent } from './userlist/userlist.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full'
  },
  {
    path: 'home', 
    component: HomeComponent
  },
  {
    path: 'registration', 
    component: RegistrationComponent
  },
  {
    path: 'patient-portal', 
    component: PatientPortalComponent,
    data: {requiresAuth: true},
    canActivate: [AuthService]
  },
  {
    path: 'userlist',
    component: UserlistComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    data: {requiresAuth: true},
    canActivate: [AuthService]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
