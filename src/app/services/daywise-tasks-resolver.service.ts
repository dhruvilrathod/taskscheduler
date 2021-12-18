import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, EMPTY, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DaywiseTasksResolverService {
  public date;
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { 
    this.getTasksOfDate(this.date).subscribe(data=>{
      console.log(data);
    })
  }


  // resolve(): Observable<any> {
  //   return this.getMyTasks().pipe(
  //     catchError((e) => {
  //       this.router.navigateByUrl('/errorpage');
  //       console.log(e);
  //       return EMPTY;
  //     }));
  // }

  public getTasksOfDate(date): Observable<any> {
    this.date = date;
    console.log(date);
    var url = 'http://localhost:3000/mytasks?date=' + date;
    // var url = 'https://d767-2402-8100-3981-940d-d1a1-e88e-cec2-862d.ngrok.io/mytasks?date=' + date;
    console.log(url);
    let data1 = this.http.get(url);
    console.log(data1);
    return data1;
  }
}
