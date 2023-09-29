/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FooterComponent } from './app/footer/footer.component';
import { AppModule } from './app/app.module';
import { NavbarComponent } from './app/navbar/navbar.component';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
