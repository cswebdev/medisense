import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { PatientPortalComponent } from './patient-portal/patient-portal.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { VerifiedEmailGuard } from './guards/verified-email.guard';
import { UserResolverService } from './services/user-resolver.service';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login', 
    component: LoginComponent,
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
    canActivate: [AuthGuard, VerifiedEmailGuard]  // Add EmailVerifiedGuard here
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    resolve: { user: UserResolverService },
    canActivate: [AuthGuard, VerifiedEmailGuard]  // Add EmailVerifiedGuard here
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
