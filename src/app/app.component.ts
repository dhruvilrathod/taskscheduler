import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'taskscheduler';
  screenSizeMatch: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
      if(screen.width <= 1200) {
        this.screenSizeMatch = false;
      }
      else this.screenSizeMatch = true;
  }

  onResize(e) {
    // console.log(e.target);
    if(e.target.innerWidth < 1200) {
      this.screenSizeMatch = false;
    } else {
      this.screenSizeMatch = true;
    }
  }

}
