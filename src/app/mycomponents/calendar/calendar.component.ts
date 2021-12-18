import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DaywiseTasksResolverService } from 'src/app/services/daywise-tasks-resolver.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  public loading: boolean = false;
  public tasks: any;
  public month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public days_name = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public febDays: number = 28;
  days_of_month = [31, this.febDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  public days1 = [[], [], [], [], [], []]
  public today = new Date();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
  public nextMonth;
  public previousMonth;
  public dayID;
  public daySelected: boolean = false;
  public selectedDay;
  public selectedMonth;
  public selectedYear;
  public tasknum: number;
  public fileNames = [];
  public isAttechment = [];
  public checkBoxValue: string;
  public deleteTaskName: string;
  taskEditForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,
    private formbuilder: FormBuilder,
    private router: Router,
    private dayWiseService: DaywiseTasksResolverService,
  ) {
  }

  ngOnInit(): void {
    this.tasks = [];
    this.formBuildFunction();
    // this.getTaskDetails();
    this.generateCalendar(this.month, this.year);
    console.log('monthCount: ' + this.month);
    console.log('year: ' + this.year);
  }

  formBuildFunction() {
    console.log('form build function is called');
    this.taskEditForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      done: [],
      attechment: []
    });
  }

  onFileSelected(event) {
    console.log("on file selected is called");

    for (var i = 0; i < event.target.files.length; i++) {
      var selectedFile = event.target.files[i];
      this.fileNames.push(selectedFile);
    }
    console.log(this.fileNames);
    if (this.fileNames.length > 0) {
      this.isAttechment[this.tasknum] = true;
    }
    else this.isAttechment[this.tasknum] = false;
    console.log(this.isAttechment[this.tasknum]);
  }
  removeFile(i) {
    console.log('file to remove: ' + this.fileNames[i].name);
    this.fileNames.splice(i, 1);
    if (this.fileNames.length > 0) {
      this.isAttechment[this.tasknum] = true;
    }
    else this.isAttechment[this.tasknum] = false;
    console.log(this.isAttechment[this.tasknum]);

  }
  editTaskDetails(task: any, tasknumber) {
    this.tasknum = tasknumber;
    console.log('edit task details function called,form will open');
    console.log(tasknumber);
    console.log(task.taskname);
    console.log(task.priority);
    console.log(task.date);
    console.log(task.description);
    console.log(task.attechment);
    this.fileNames = [];
    var attechmentLength = task.attechment.length;
    console.log(attechmentLength);
    if (attechmentLength < 1 || task.attechment.name == "") {
      console.log('if executed');
      this.fileNames = [];
    }
    else {
      this.fileNames = task.attechment;
    }
    console.log('fileNames[]= ' + this.fileNames);
    console.log('preatteched= ' + this.tasks[tasknumber].attechment);

    this.taskEditForm.get('taskname').setValue(task.taskname);
    this.taskEditForm.get('priority').setValue(task.priority);
    this.taskEditForm.get('date').setValue(task.date);
    this.taskEditForm.get('description').setValue(task.description);
    this.taskEditForm.get('done').setValue(task.done);
    // console.log(this.taskEditForm.get('done').value);
  }
  deleteTask(task: any) {
    console.log('delete tasks function called');
    console.log(task.taskname);
    this.deleteTaskName = task.taskname;
  }
  updateTask(updatedTask) {
    console.log('update tasks function called');
    console.log("task updated ");
    updatedTask.value.attechment = this.fileNames;
    console.log(updatedTask.value);
    this.fileNames = [];
  }
  markAsDone(taskid) {
    console.log(taskid);
    if (this.tasks.isdone === true) {
      console.log(taskid + ' is done = true');
      this.tasks.done = false;
    }
    else {
      console.log('is done = false');
      this.tasks.done = true;
    }
  }

  generateCalendar(m, y) {
    if(y % 4 === 0){
      this.days_of_month[1] = 29;
    }
    else this.days_of_month[1] = 28;
    this.days1 = [[],[],[],[],[],[]]

    var firstDay = new Date(y, m, 1).getDay();
    console.log('firstday: ' + firstDay);
    console.log('month: ' + this.month_names[m]);
    console.log('year: ' + y);
    console.log('total days: ' + this.days_of_month[m]);

    var dayCount = 0;
    var rows;
    if ((this.days_of_month[m] === 28) && firstDay === 0) {
      rows = 4;
    }
    else if(this.days_of_month[m]>29 && firstDay > 4){
      rows = 6
    }
    else rows = 5;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < 7; j++) {
        if (j < firstDay && dayCount === 0) {
          this.days1[i][j] = null;
        }
        else if (dayCount >= this.days_of_month[m]) {
          this.days1[i][j] = null;
        }
        else {
          this.days1[i][j] = dayCount + 1;
          dayCount++;
        }
      }
    }
    console.log(this.days1);
    if (this.month + 1 > 11) {
      this.nextMonth = 0;
    }
    else this.nextMonth = this.month + 1;
    if (this.month - 1 < 0) {
      this.previousMonth = 11;
    }
    else this.previousMonth = this.month - 1;
  }


  nextMonthButton() {
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    console.log('next month pressed: ' + this.month_names[this.month] + ', ' + this.year);
    this.generateCalendar(this.month, this.year);
  }

  previousMonthButton() {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    }
    else this.month--;
    console.log('prevoius month button pressed: ' + this.month_names[this.month] + ', ' + this.year);
    this.generateCalendar(this.month, this.year);
  }

  currentMonthButton() {
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
    console.log(this.month);
    console.log(this.year);
    this.generateCalendar(this.month, this.year);
  }

  daySelectedFunction(event) {
    console.log('day selected functions is called.');
    console.log(this.tasks);
    this.loading = true;
    this.daySelected = true;
    this.selectedDay = event.target.innerText.toString().padStart(2, 0);
    this.selectedMonth = (this.month + 1).toString().padStart(2, '0');
    this.selectedYear = this.year.toString();
    var queryDay = this.selectedYear + '-' + this.selectedMonth + '-' + this.selectedDay;
    console.log(queryDay);
    this.serviceFunction(queryDay);
  }

  serviceFunction(queryDay) {
    this.dayWiseService.getTasksOfDate(queryDay).subscribe(data => {
      // console.log(data);
      // console.log(this.activatedRoute.snapshot);
      this.tasks = data;
      // this.appComponent.loading = false;
      for (var i = 0; i < this.tasks.length; i++) {
        // console.log(this.tasks[i].prno);
        if (this.tasks[i].attechment[0].name === "") {
          this.isAttechment[i] = false;
        }
        else {
          this.isAttechment[i] = true;
        }
      }
      this.loading = false;
    });

  }

  backToCalendarFunction() {
    console.log('back to calendar called');
    this.daySelected = false;
    this.tasks = [];
    this.fileNames = [];
  }

  hoverEnterFunction(event) {
    // console.log('hover td function called');
    // console.log(event.target.innerText);
    if (event.target.innerText !== '') {
      event.target.style.backgroundColor = 'silver';
      event.target.style.cursor = 'pointer';
      this.dayID = this.year.toString() + '-' + this.month.toString().padStart(2, '0') + '-' + event.target.innerText;
      // console.log(this.dayID);  
    }
  }
  hoverLeaveFunction(event) {
    // console.log('hover leave function is called');
    event.target.style.backgroundColor = 'white';
  }
}
