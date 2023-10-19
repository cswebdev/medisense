import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { PatientPortalComponent } from './patient-portal/patient-portal.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from './services/auth.service';
import { NewUserResolverService } from './services/new-user-resolver.service';

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
    resolve: { user: NewUserResolverService },
    data: { requiresAuth: true },
    canActivate: [AuthService]
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
