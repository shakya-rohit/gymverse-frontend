import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MembersComponent } from './components/members/members.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { NgChartsModule } from 'ng2-charts';
import { TrainersComponent } from './components/trainers/trainers.component';
import { MembershipPlansComponent } from './components/membership-plans/membership-plans.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { MatSelectModule } from '@angular/material/select';
import { MemberProfileDialogComponent } from './components/member-profile-dialog/member-profile-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { TrainerProfileDialogComponent } from './components/trainer-profile-dialog/trainer-profile-dialog.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoginComponent } from './components/login/login.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegisterComponent } from './components/register/register.component';
import { MemberDialogComponent } from './components/member-dialog/member-dialog.component';
import { TrainerDialogComponent } from './components/trainer-dialog/trainer-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    MembersComponent,
    TrainersComponent,
    MembershipPlansComponent,
    HeaderComponent,
    FooterComponent,
    MemberProfileDialogComponent,
    ConfirmDialogComponent,
    TrainerProfileDialogComponent,
    LoginComponent,
    DefaultLayoutComponent,
    AuthLayoutComponent,
    RegisterComponent,
    MemberDialogComponent,
    TrainerDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NgChartsModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
