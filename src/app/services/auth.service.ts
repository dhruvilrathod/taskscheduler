import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public errorMessage: string;

  constructor(
    private http: HttpClient,
  ) { }

  login(body) {
    console.log('this will login with firebases');
    return this.http.post("https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/login", body, { responseType: 'text' });
  }
  registration(body) {
    return this.http.post('https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/register', body, { responseType: 'text' });
  }
}
