import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './mycomponents/about/about.component';
import { AddnewtaskComponent } from './mycomponents/addnewtask/addnewtask.component';
import { CalendarComponent } from './mycomponents/calendar/calendar.component';
import { ErrorpageComponent } from './mycomponents/errorpage/errorpage.component';
import { HomeComponent } from './mycomponents/home/home.component';
import { LoginComponent } from './mycomponents/login/login.component';
import { MyaccountComponent } from './mycomponents/myaccount/myaccount.component';
import { MytasksComponent } from './mycomponents/mytasks/mytasks.component';
import { PiechartComponent } from './mycomponents/piechart/piechart.component';
import { ReportComponent } from './mycomponents/report/report.component';
import { RoutineComponent } from './mycomponents/routine/routine.component';
import { TimetableComponent } from './mycomponents/timetable/timetable.component';
import { DateVerificationResolverService } from './services/date-verification-resolver.service';
import { DaywiseTasksResolverService } from './services/daywise-tasks-resolver.service';
import { MytasksResolverService } from './services/mytasks-resolver.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent,
    children: [
      {
        path: 'my-tasks', component: MytasksComponent,
        resolve: { myTasksDetails: MytasksResolverService }
      },
      {
        path: 'add-task', component: AddnewtaskComponent,
        resolve: { specialDates: DateVerificationResolverService }
      },
      { path: 'add-routine', component: RoutineComponent },
      {
        path: 'calendar', component: CalendarComponent,
      },
      { path: 'weekly-timetable', component: TimetableComponent },
      { path: 'pie-chart', component: PiechartComponent },
      { path: 'report', component: ReportComponent },
      { path: 'my-account', component: MyaccountComponent },
      { path: 'about', component: AboutComponent },
      { path: '', redirectTo: 'my-tasks', pathMatch: 'full' }
    ]
  },
  { path: 'error-page', component: ErrorpageComponent },
  { path: '**', redirectTo: 'error-page' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
