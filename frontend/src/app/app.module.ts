import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { PatientPortalComponent } from './patient-portal/patient-portal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { MedicationComponent } from './medication/medication.component';
import { MedicationsListComponent } from './medications-list/medications-list.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GlobalAlertComponent } from './global-alert/global-alert.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { SafeHtmlPipe } from './services/safe-html.pipe';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    PatientPortalComponent,
    NavbarComponent,
    LoginComponent,
    FooterComponent,
    UserProfileComponent,
    EditUserProfileComponent,
    MedicationComponent,
    MedicationsListComponent,
    SearchBarComponent,
    GlobalAlertComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    LoadingOverlayComponent,
    ResetPasswordComponent,
    ChatbotComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    TooltipModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


