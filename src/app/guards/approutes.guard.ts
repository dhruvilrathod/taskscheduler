import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApproutesGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }
  canActivate() {
    if(!localStorage.getItem('auth-token')) {
      this.router.navigate(['']);
      return false;
    }
    else return true;
  }
}
