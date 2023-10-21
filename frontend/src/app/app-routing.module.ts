import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { PatientPortalComponent } from './patient-portal/patient-portal.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { AuthService } from './services/auth.service';
import { UserResolverService } from './services/user-resolver.service';

const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full',
    redirectTo: 'home', // Redirect to home if the path is empty
  },
  {
    path: 'home', 
    component: HomeComponent,
    data: { requiresAuth: false },
    canActivate: [AuthService]
    
    // canActivate: [AuthService] // Remove AuthService if home route does not require authentication
  },
  {
    path: 'registration', 
    component: RegistrationComponent,
    data: { requiresAuth: false },
    canActivate: [AuthService]
    // canActivate: [AuthService] // Remove AuthService if registration route does not require authentication
  },
  {
    path: 'patient-portal', 
    component: PatientPortalComponent,
    resolve: { user: UserResolverService },
    data: { requiresAuth: true },
    canActivate: [AuthService]
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    resolve: { user: UserResolverService },
    data: {requiresAuth: true},
    canActivate: [AuthService]
  },
  {
    path: 'edit-user-profile',
    component: EditUserProfileComponent,
    resolve: { user: UserResolverService },
    data: {requiresAuth: true},
    canActivate: [AuthService]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
