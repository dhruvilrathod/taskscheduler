import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


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
  public weekDay = this.today.getDay();
  public nextMonth;
  public previousMonth;
  public dayID;
  public daySelected: boolean = false;
  public selectedDay;
  public selectedMonth: any;
  public selectedYear;
  public tasknum: number;
  public deleteTaskName: string;
  public deleteTaskId: string;

  public taskEditForm: FormGroup;
  public isRoutine: boolean = false;
  public routineType1: boolean = true;
  public routineType2: boolean = false;
  public routineType3: boolean = false;
  public routineType4: boolean = false;
  public routineEditForm: FormGroup;

  public specialDates: any;
  public isSpecialDate: boolean = false;
  public isSubmitting: boolean = false;
  public errorMessage: string = "";
  public isError = false;
  public submissionSuccessful: boolean = false;
  public occasion: string;
  public event;

  constructor(
    private datepipe: DatePipe,
    private formbuilder: FormBuilder,
    private titleService: Title,
    private http: HttpClient
  ) {
    this.titleService.setTitle("Calendar")
  }

  ngOnInit(): void {
    this.tasks = [];
    this.formBuildFunction();
    this.generateCalendar(this.month, this.year);
  }

  showForm1() {
    //console.log('show form called');
    this.routineType1 = true;
    this.routineType2 = false;
    this.routineType3 = false;
    this.routineType4 = false;
    this.routineEditForm.get('hh').setValidators(Validators.required);
    this.routineEditForm.get('mm').setValidators(Validators.required);
    this.routineEditForm.get('ampm').setValidators(Validators.required);
    this.routineEditForm.get('day').clearValidators();
    this.routineEditForm.get('month').clearValidators();
    this.routineEditForm.get('date').clearValidators();
    this.routineEditForm.updateValueAndValidity();
    this.routineEditForm.get('routine_type').setValue('1');
  }
  showForm2() {
    //console.log('show form called');
    this.routineType1 = false;
    this.routineType2 = true;
    this.routineType3 = false;
    this.routineType4 = false;
    this.routineEditForm.get('hh').clearValidators();
    this.routineEditForm.get('mm').clearValidators();
    this.routineEditForm.get('ampm').clearValidators();
    this.routineEditForm.get('day').setValidators(Validators.required);
    this.routineEditForm.get('month').clearValidators();
    this.routineEditForm.get('date').clearValidators();
    this.routineEditForm.updateValueAndValidity();
    this.routineEditForm.get('routine_type').setValue('2');
  }
  showForm3() {
    //console.log('show form called');
    this.routineType1 = false;
    this.routineType2 = false;
    this.routineType3 = true;
    this.routineType4 = false;
    this.routineEditForm.get('hh').clearValidators();
    this.routineEditForm.get('mm').clearValidators();
    this.routineEditForm.get('ampm').clearValidators();
    this.routineEditForm.get('day').clearValidators();
    this.routineEditForm.get('month').clearValidators();
    this.routineEditForm.get('date').setValidators(Validators.required);
    this.routineEditForm.updateValueAndValidity();
    this.routineEditForm.get('routine_type').setValue('3');
  }
  showForm4() {
    //console.log('show form called');
    this.routineType1 = false;
    this.routineType2 = false;
    this.routineType3 = false;
    this.routineType4 = true;
    this.routineEditForm.get('hh').clearValidators();
    this.routineEditForm.get('mm').clearValidators();
    this.routineEditForm.get('ampm').clearValidators();
    this.routineEditForm.get('day').clearValidators();
    this.routineEditForm.get('month').setValidators(Validators.required);
    this.routineEditForm.get('date').setValidators(Validators.required);
    this.routineEditForm.updateValueAndValidity();
    this.routineEditForm.get('routine_type').setValue('4');
  }

  formBuildFunction() {
    this.taskEditForm = this.formbuilder.group({
      task_id: ['', Validators.required],
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      startdate: ['', Validators.required],
      deadline: ['', Validators.required],
      description: [''],
      done: [],
      routine_type: ['0']
    });
    this.routineEditForm = this.formbuilder.group({
      task_id: ['', Validators.required],
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      hh: ['', Validators.required],
      mm: ['', Validators.required],
      ampm: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      routine_type: ['', Validators.required],
      done: []
    });
  }

  editTaskDetails(task: any) {
    if (task.routine_type == "0") this.isRoutine = false;
    else this.isRoutine = true;
    if (!this.isRoutine) {
      this.taskEditForm.get('taskname').setValue(task.taskname);
      this.taskEditForm.get('task_id').setValue(task._id);
      this.taskEditForm.get('priority').setValue(task.prno);
      this.taskEditForm.get('startdate').setValue(formatDate(task.date_start, 'yyyy-MM-dd', 'en'));
      this.taskEditForm.get('deadline').setValue(formatDate(new Date(task.deadline), 'yyyy-MM-dd', 'en'));
      this.taskEditForm.get('description').setValue(task.description);
      this.taskEditForm.get('done').setValue(task.is_completed);
      this.taskEditForm.get('routine_type').setValue('0');
    }
    else {
      switch (task.routine_type) {
        case "1":
          this.routineType1 = true;
          this.routineType2 = false;
          this.routineType3 = false;
          this.routineType4 = false;
          this.routineEditForm.get('hh').setValidators(Validators.required);
          this.routineEditForm.get('mm').setValidators(Validators.required);
          this.routineEditForm.get('ampm').setValidators(Validators.required);
          this.routineEditForm.get('day').clearValidators();
          this.routineEditForm.get('month').clearValidators();
          this.routineEditForm.get('date').clearValidators();
          this.routineEditForm.updateValueAndValidity();
          break;
        case "2":
          this.routineType1 = false;
          this.routineType2 = true;
          this.routineType3 = false;
          this.routineType4 = false;
          this.routineEditForm.get('hh').clearValidators();
          this.routineEditForm.get('mm').clearValidators();
          this.routineEditForm.get('ampm').clearValidators();
          this.routineEditForm.get('day').setValidators(Validators.required);
          this.routineEditForm.get('month').clearValidators();
          this.routineEditForm.get('date').clearValidators();
          this.routineEditForm.updateValueAndValidity();
          break;
        case "3":
          this.routineType1 = false;
          this.routineType2 = false;
          this.routineType3 = true;
          this.routineType4 = false;
          this.routineEditForm.get('hh').clearValidators();
          this.routineEditForm.get('mm').clearValidators();
          this.routineEditForm.get('ampm').clearValidators();
          this.routineEditForm.get('day').clearValidators();
          this.routineEditForm.get('month').clearValidators();
          this.routineEditForm.updateValueAndValidity();
          break;
        case "4":
          this.routineType1 = false;
          this.routineType2 = false;
          this.routineType3 = false;
          this.routineType4 = true;
          this.routineEditForm.get('hh').clearValidators();
          this.routineEditForm.get('mm').clearValidators();
          this.routineEditForm.get('ampm').clearValidators();
          this.routineEditForm.get('day').clearValidators();
          this.routineEditForm.get('month').setValidators(Validators.required);
          this.routineEditForm.get('date').setValidators(Validators.required);
          this.routineEditForm.updateValueAndValidity();
          break;
        default:
          break;
      }
      this.routineEditForm.get('task_id').setValue(task._id);
      this.routineEditForm.get('taskname').setValue(task.taskname);
      this.routineEditForm.get('priority').setValue(task.prno);
      this.routineEditForm.get('hh').setValue(task.hh);
      this.routineEditForm.get('mm').setValue(task.mm);
      this.routineEditForm.get('ampm').setValue(task.ampm);
      this.routineEditForm.get('day').setValue(task.day);
      this.routineEditForm.get('date').setValue(task.date);
      this.routineEditForm.get('month').setValue(task.month);
      this.routineEditForm.get('routine_type').setValue(task.routine_type);
      this.routineEditForm.get('description').setValue(task.description);
      this.routineEditForm.get('done').setValue(task.is_completed);
    }
  }

  verifytDeadline(e: any) {
    if (new Date(this.taskEditForm.get('startdate').value).getTime() > new Date(this.taskEditForm.get('deadline').value).getTime()) {
      this.taskEditForm.get('deadline').setErrors({ notEquivalent: 'ture' });
    }
  }

  checkSpecialDate(tdate) {
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

  deleteTaskModal(task: any) {
    this.deleteTaskName = task.taskname;
    this.deleteTaskId = task._id;
    document.getElementById('deletetaskModal').classList.add('show');
    document.getElementById('deletetaskModal').setAttribute('aria-hidden', 'false');
    document.getElementById('deletetaskModal').setAttribute('style', 'display: block');
    var modalBackdrops = document.createElement('div');
    modalBackdrops.classList.add('modal-backdrop', 'fade', 'show');
    document.body.appendChild(modalBackdrops);
  }

  closeModal() {
    //console.log(document.getElementById('deletetaskModal'));
    document.getElementById('deletetaskModal').classList.remove('show');
    document.getElementById('deletetaskModal').setAttribute('aria-hidden', 'true');
    document.getElementById('deletetaskModal').setAttribute('style', 'display: none');
    const modalBackdrops = document.getElementsByClassName('modal-backdrop');
    //console.log(modalBackdrops);
    document.body.removeChild(modalBackdrops[0]);
  }

  deleteTask() {
    //console.log(this.deleteTaskId);
    this.isSubmitting = true;
    this.http.delete('https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/tasks/deleteTask', { headers: { 'auth-token': localStorage.getItem('auth-token') }, params: { 'task_id': this.deleteTaskId } }).subscribe((data) => {
      //console.log(data);
      this.loading = false;
      this.isSubmitting = false;
      this.submissionSuccessful = true;
      this.isError = false;
      this.tasks = [];
      this.deleteTaskName = null;
      this.deleteTaskId = null;
      this.closeModal();
      this.daySelectedFunction(this.event);
    }, (err) => {
      this.loading = false;
      this.submissionSuccessful = false;
      this.isError = true;
      this.errorMessage = err;
      this.isSubmitting = false;
      this.deleteTaskName = null;
      this.deleteTaskId = null;
      this.closeModal()
      this.daySelectedFunction(this.event);
    });
  }

  updateTask(newTaskData) {
    this.isSubmitting = true;
    var newTask = {};
    //console.log(newTaskData);
    if (newTaskData.value.routine_type == '0') {
      var date_start = this.month_names[new Date(newTaskData.value.startdate).getMonth()] + ' ' + newTaskData.value.startdate.split('-')[2] + ', ' + newTaskData.value.startdate.split('-')[0];
      var deadline = this.month_names[new Date(newTaskData.value.deadline).getMonth()] + ' ' + newTaskData.value.deadline.split('-')[2] + ', ' + newTaskData.value.deadline.split('-')[0];
      newTask = {
        _id: newTaskData.value.task_id,
        taskname: newTaskData.value.taskname,
        prno: newTaskData.value.priority,
        date_start: date_start,
        deadline: deadline,
        date_completed: "",
        description: newTaskData.value.description,
        time: "",
        routine_type: "0",
        is_completed: newTaskData.value.done
      }
    }
    else if (newTaskData.value.routine_type == '1') {
      newTask = {
        _id: newTaskData.value.task_id,
        taskname: newTaskData.value.taskname,
        prno: newTaskData.value.priority,
        routine_type: newTaskData.value.routine_type,
        hh: newTaskData.value.hh,
        mm: newTaskData.value.mm,
        ampm: newTaskData.value.ampm,
        day: '',
        date: '',
        month: '',
        is_completed: newTaskData.value.is_completed,
        description: newTaskData.value.description
      }
    }
    else if (newTaskData.value.routine_type == '2') {
      newTask = {
        _id: newTaskData.value.task_id,
        taskname: newTaskData.value.taskname,
        prno: newTaskData.value.priority,
        routine_type: newTaskData.value.routine_type,
        hh: newTaskData.value.hh,
        mm: newTaskData.value.mm,
        ampm: newTaskData.value.ampm,
        day: newTaskData.value.day,
        date: '',
        month: '',
        is_completed: newTaskData.value.is_completed,
        description: newTaskData.value.description
      }
    }
    else if (newTaskData.value.routine_type == '3') {
      newTask = {
        _id: newTaskData.value.task_id,
        taskname: newTaskData.value.taskname,
        prno: newTaskData.value.priority,
        routine_type: newTaskData.value.routine_type,
        hh: '',
        mm: '',
        ampm: '',
        day: '',
        date: newTaskData.value.date,
        month: '',
        is_completed: newTaskData.value.is_completed,
        description: newTaskData.value.description
      }
    }
    else if (newTaskData.value.routine_type == '4') {
      newTask = {
        _id: newTaskData.value.task_id,
        taskname: newTaskData.value.taskname,
        prno: newTaskData.value.priority,
        routine_type: newTaskData.value.routine_type,
        hh: '',
        mm: '',
        ampm: '',
        day: '',
        date: newTaskData.value.date,
        month: newTaskData.value.month,
        is_completed: newTaskData.value.is_completed,
        description: newTaskData.value.description
      }
    }

    this.http.put('https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/tasks/updateTask', newTask, { headers: { 'auth-token': localStorage.getItem('auth-token') } }).subscribe((data) => {
      //console.log(data);
      this.isSubmitting = false;
      this.submissionSuccessful = true;
      this.isError = false;
      document.getElementById('taskModal').classList.remove('show');
      document.getElementById('taskModal').setAttribute('aria-hidden', 'true');
      document.getElementById('taskModal').setAttribute('style', 'display: none');
      const modalBackdrops = document.getElementsByClassName('modal-backdrop');
      document.body.removeChild(modalBackdrops[0]);
      this.tasks = [];
      this.daySelectedFunction(this.event);
    }, (err) => {
      this.submissionSuccessful = false;
      this.isError = true;
      this.errorMessage = err;
      this.isSubmitting = false;
      document.getElementById('taskModal').classList.remove('show');
      document.getElementById('taskModal').setAttribute('aria-hidden', 'true');
      document.getElementById('taskModal').setAttribute('style', 'display: none');
      const modalBackdrops = document.getElementsByClassName('modal-backdrop');
      document.body.removeChild(modalBackdrops[0]);
    });
  }
  markAsDone(taskid, status) {
    this.loading = true;
    var newTask = {
      _id: taskid,
      is_completed: !status
    }
    this.http.put('https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/tasks/updateTask', newTask, { headers: { 'auth-token': localStorage.getItem('auth-token') } }).subscribe((data) => {
      //console.log(data);
      this.loading = false;
      this.isSubmitting = false;
      this.submissionSuccessful = true;
      this.isError = false;
      this.tasks = [];
      this.daySelectedFunction(this.event);
    }, (err) => {
      this.loading = false;
      this.submissionSuccessful = false;
      this.isError = true;
      this.errorMessage = err;
      this.isSubmitting = false;
    });
  }

  generateCalendar(m, y) {
    if (y % 4 === 0) {
      this.days_of_month[1] = 29;
    }
    else this.days_of_month[1] = 28;
    this.days1 = [[], [], [], [], [], []]

    var firstDay = new Date(y, m, 1).getDay();

    var dayCount = 0;
    var rows;
    if ((this.days_of_month[m] === 28) && firstDay === 0) {
      rows = 4;
    }
    else if (this.days_of_month[m] > 29 && firstDay > 4) {
      rows = 6
    }
    else rows = 5;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < 7; j++) {
        if (j < firstDay && dayCount === 0) {
          this.days1[i][j] ='';
        }
        else if (dayCount >= this.days_of_month[m]) {
          this.days1[i][j] = '';
        }
        else {
          this.days1[i][j] = dayCount + 1;
          dayCount++;
        }
      }
    }
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
    this.generateCalendar(this.month, this.year);
  }

  previousMonthButton() {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    }
    else this.month--;
    this.generateCalendar(this.month, this.year);
  }

  currentMonthButton() {
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
    //console.log(this.month);
    //console.log(this.year);
    this.generateCalendar(this.month, this.year);
  }

  daySelectedFunction(event) {
    this.specialDates = [];
    //console.log(this.tasks, this.month_names[this.month]);
    if (event.target.innerText == '') return;
    this.event = event;
    this.loading = true;
    this.daySelected = true;
    this.selectedDay = event.target.innerText;
    var queryDay = this.month_names[this.month] + ' ' + this.selectedDay + ', ' + this.year;
    this.weekDay = new Date(queryDay).getDay();
    let param = new HttpParams();
    param = param.append("calender_date", queryDay);
    this.http.get("https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/specialdates", { headers: { 'auth-token': localStorage.getItem('auth-token') } }).subscribe((data) => {
      this.specialDates = data;
      this.http.get("https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/tasks/getTask", { headers: { 'auth-token': localStorage.getItem('auth-token') }, params: param }).subscribe((data) => {
        this.tasks = data;
        this.loading = false;
        //console.log(this.tasks);
      }, (e) => {
        //console.log(e);
      });
    }, (e) => {
      //console.log(e);
    });
  }

  backToCalendarFunction() {
    this.daySelected = false;
    this.tasks = [];
  }

  hoverEnterFunction(event) {
    if (event.target.innerText !== '') {
      event.target.style.backgroundColor = 'silver';
      event.target.style.cursor = 'pointer';
      this.dayID = this.year.toString() + '-' + this.month.toString().padStart(2, '0') + '-' + event.target.innerText;
    }
  }
  hoverLeaveFunction(event) {
    event.target.style.backgroundColor = 'white';
  }
}
