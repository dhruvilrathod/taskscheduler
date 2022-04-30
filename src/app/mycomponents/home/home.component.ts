import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private titleService: Title,
    private router: Router
  ) {
    this.titleService.setTitle("Home")
  }

  ngOnInit(): void {
  }

  userLogout() {
    if(!localStorage.getItem('auth-token')) return this.router.navigate(['']);
    localStorage.removeItem('auth-token');
    this.router.navigate(['/login']);
  }

}
