import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { PatientPortalComponent } from './patient-portal/patient-portal.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { UserResolverService } from './services/user-resolver.service';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'registration', 
    component: RegistrationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'patient-portal', 
    component: PatientPortalComponent,
    resolve: { user: UserResolverService },
    canActivate: [AuthGuard]
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    resolve: { user: UserResolverService },
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-user-profile',
    component: EditUserProfileComponent,
    resolve: { user: UserResolverService },
    canActivate: [AuthGuard]
  },
  {
    path: 'change-email',
    component: ChangeEmailComponent,
    resolve: { user: UserResolverService },
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    resolve: { user: UserResolverService },
    canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
