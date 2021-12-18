import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'taskscheduler';
  loading: boolean = false;

  constructor(router: Router) {
    // console.log(this.loading);

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
        // console.log(this.loading);
      }
      if (event instanceof NavigationEnd) {
        this.loading = false;
        // console.log(this.loading);
      }
    });
    // console.log('this is from app.component.ts');
  }
}
