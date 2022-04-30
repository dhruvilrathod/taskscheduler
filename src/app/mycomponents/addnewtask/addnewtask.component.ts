import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-addnewtask',
  templateUrl: './addnewtask.component.html',
  styleUrls: ['./addnewtask.component.css']
})

export class AddnewtaskComponent implements OnInit {
  addTaskForm: FormGroup;
  public isSubmitting: boolean = false;
  public errorMessage: string = "";
  public isError = false;
  public submissionSuccessful: boolean = false;
  public specialDates: any;
  public today: any;
  public isSpecialDate: boolean = false;
  public selectedDate: number;
  public selectedMonth: string;
  public selectedYear: number;
  public occasion: string;
  public loading: boolean = false;
  public month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public days_name = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private titleService: Title,
  ) { this.titleService.setTitle('Add New Task') }

  ngOnInit(): void {
    this.loading = true;
    this.http.get("https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/specialdates", { headers: { 'auth-token': localStorage.getItem('auth-token') } }).subscribe((data) => {
      this.specialDates = data;
      this.loading = false;
    }, (e) => {
      //console.log(e);
    });
    this.formBuildFunction();
    this.todayDateValidation();
  }

  formBuildFunction() {
    //console.log('form build function is called');
    this.addTaskForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      startdate: ['', Validators.required],
      deadline: ['', Validators.required],
      description: [''],
      done: [],
    });
  }

  resetForm() {
    //console.log('resetForm function is called');
    this.formBuildFunction();
    this.isSpecialDate = false;
  }


  addNewTask(newTaskData) {
    this.isSubmitting = true;
    var date_start = this.month_names[new Date(newTaskData.value.startdate).getMonth()] + ' ' + newTaskData.value.startdate.split('-')[2] + ', ' + newTaskData.value.startdate.split('-')[0];
    var deadline = this.month_names[new Date(newTaskData.value.deadline).getMonth()] + ' ' + newTaskData.value.deadline.split('-')[2] + ', ' + newTaskData.value.deadline.split('-')[0];
    var newTask = {
      taskname: newTaskData.value.taskname,
      prno: newTaskData.value.priority,
      date_start: date_start,
      deadline: deadline,
      date_completed: "",
      description: newTaskData.value.description,
      time: "",
      routine_type: "0",
      is_completed: false
    }
    this.http.post('https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/tasks/addNewTask', newTask, { headers: { 'auth-token': localStorage.getItem('auth-token') } }).subscribe((data) => {
      //console.log(data);
      this.isSubmitting = false;
      this.submissionSuccessful = true;
      this.isError = false;
      this.resetForm();
    }, (err) => {
      this.submissionSuccessful = false;
      this.isError = true;
      this.errorMessage = err;
      this.isSubmitting = false;
    });
  }

  //function to make sure that user only select future dates for new tasks
  todayDateValidation() {
    //console.log('date piker function is called');
    var today = new Date();
    var date1 = ('0' + today.getDate().toString()).slice(-2);
    var month1 = ('0' + (today.getMonth() + 1).toString()).slice(-2);
    var year1 = today.getFullYear();
    this.today = year1 + '-' + month1 + '-' + date1;
  }

  verifytDeadline(e: any) {
    if (new Date(this.addTaskForm.get('startdate').value).getTime() > new Date(this.addTaskForm.get('deadline').value).getTime()) {
      this.addTaskForm.get('deadline').setErrors({ notEquivalent: 'ture' });
    }
  }

  checkSpecialDate(tdate) {
    if (new Date(this.addTaskForm.get('startdate').value).getTime() < new Date().setHours(5, 30, 0, 0)) {
      this.addTaskForm.get('startdate').setErrors({ notEquivalent: 'ture' });
    }
    var d1 = tdate.target.value;
    //console.log(d1);
    d1 = d1.split('-')[0] + '-' + d1.split('-')[1] + '-' + d1.split('-')[2];
    //console.log(d1);
    for (var i in this.specialDates) {
      //console.log(this.specialDates[i].date, d1)
      if (this.specialDates[i].year + '-' + this.specialDates[i].month + '-' + this.specialDates[i].date == d1) {
        this.occasion = this.specialDates[i].occasion;
        this.isSpecialDate = true;
        break;
      }
      else {
        this.isSpecialDate = false;
        this.occasion = ""
      }
    }
  }
}


