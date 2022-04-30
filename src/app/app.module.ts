import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MytasksComponent } from './mycomponents/mytasks/mytasks.component';
import { AddnewtaskComponent } from './mycomponents/addnewtask/addnewtask.component';
import { LoginComponent } from './mycomponents/login/login.component';
import { HomeComponent } from './mycomponents/home/home.component';
import { RoutineComponent } from './mycomponents/routine/routine.component';
import { CalendarComponent } from './mycomponents/calendar/calendar.component';
import { TimetableComponent } from './mycomponents/timetable/timetable.component';
import { PiechartComponent } from './mycomponents/piechart/piechart.component';
import { ReportComponent } from './mycomponents/report/report.component';
import { MyaccountComponent } from './mycomponents/myaccount/myaccount.component';
import { AboutComponent } from './mycomponents/about/about.component';
import { ErrorpageComponent } from './mycomponents/errorpage/errorpage.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RegistrationComponent } from './mycomponents/registration/registration.component';
import { ApproutesGuard } from './guards/approutes.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MytasksComponent,
    AddnewtaskComponent,
    LoginComponent,
    RoutineComponent,
    CalendarComponent,
    TimetableComponent,
    PiechartComponent,
    ReportComponent,
    MyaccountComponent,
    AboutComponent,
    ErrorpageComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe, ApproutesGuard],
  bootstrap: [AppComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppModule { }
