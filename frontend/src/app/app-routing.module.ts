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
    redirectTo: 'home'
  },
  {
    path: 'home', 
    component: HomeComponent,
    data: { requiresAuth: false },
    canActivate: [AuthService]
  },
  {
    path: 'registration', 
    component: RegistrationComponent,
    data: { requiresAuth: false },
    canActivate: [AuthService]
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
