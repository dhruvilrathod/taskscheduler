import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  public loading: boolean = false;
  public tasks: any;
  public month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public days_name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public febDays: number = 28;
  public days_of_month = [31, this.febDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  public days1 = [[], [], [], [], [], []]
  public today = new Date();
  public todaydate = this.today.getDate();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
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

  //time table variables
  public firstDayOfWeek: string = '';
  public lastDayOfWeek: string = '';
  public middleDayOfWeek: Date = this.today;
  public weeklyTasks: any = [[], [], [], [], [], [], []];
  public weeklyTasks1: any = [[], [], [], [], [], [], []];
  public firstDayDateFormat = new Date(this.middleDayOfWeek.getTime() - this.middleDayOfWeek.getDay() * 24 * 60 * 60 * 1000);
  public timetableDates = [];


  constructor(
    private datepipe: DatePipe,
    private formbuilder: FormBuilder,
    private titleService: Title,
    private http: HttpClient
  ) {
    this.titleService.setTitle("Weekly Time Table")
  }

  ngOnInit(): void {
    this.tasks = [];
    //console.log(new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 1).getDate(), this.month_names[new Date(this.firstDayDateFormat).getMonth()]);
    this.formBuildFunction();
    this.generateTimetable(this.middleDayOfWeek);
  }

  generateTimetable(t) {
    this.weeklyTasks = [[], [], [], [], [], [], []];
    this.timetableDates = [];
    //set timetable dates and days
    this.firstDayDateFormat = new Date(this.middleDayOfWeek.getTime() - this.middleDayOfWeek.getDay() * 24 * 60 * 60 * 1000);
    this.timetableDates.push(
      {
        month: this.month_names[new Date(this.firstDayDateFormat).getMonth()],
        date: new Date(this.firstDayDateFormat).getDate()
      },
      {
        month: this.month_names[new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 1).getMonth()],
        date: new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 1).getDate()
      },
      {
        month: this.month_names[new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 2).getMonth()],
        date: new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 2).getDate()
      },
      {
        month: this.month_names[new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 3).getMonth()],
        date: new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 3).getDate()
      },
      {
        month: this.month_names[new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 4).getMonth()],
        date: new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 4).getDate()
      },
      {
        month: this.month_names[new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 5).getMonth()],
        date: new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 5).getDate()
      },
      {
        month: this.month_names[new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 6).getMonth()],
        date: new Date(new Date(this.firstDayDateFormat).getTime() + 1000 * 3600 * 24 * 6).getDate()
      }
    );

    this.loading = true;
    var tempFirstDay = new Date(t.getTime() - 1000 * 60 * 60 * 24 * t.getDay());
    this.firstDayOfWeek = this.month_names[tempFirstDay.getMonth()] + ' ' + tempFirstDay.getDate() + ', ' + tempFirstDay.getFullYear();
    var tempLastDay = new Date(t.getTime() + (6 - t.getDay()) * 1000 * 60 * 60 * 24)
    this.lastDayOfWeek = this.month_names[tempLastDay.getMonth()] + ' ' + tempLastDay.getDate() + ', ' + tempFirstDay.getFullYear();
    this.http.get('https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/tasks/getTask', { headers: { 'auth-token': localStorage.getItem('auth-token') }, params: { 'week_day': this.firstDayOfWeek.toString() } }).subscribe((data) => {

      for (var x in data) {
        //console.log(data[x]);
        //console.log(new Date(data[x].date_start).getTime() == new Date().setHours(0, 0, 0, 0));
        //for loop to find out data[x] exists to which date
        for (var i = new Date(this.firstDayOfWeek).setHours(0, 0, 0, 0), c = 0; i <= new Date(this.lastDayOfWeek).setHours(0, 0, 0, 0); i += 1000 * 60 * 60 * 24, c++) {
          if (data[x].routine_type == '0') {
            if (new Date(data[x].date_start).getTime() == new Date(i).getTime()) {
              //console.log(new Date(data[x].date_start).getTime(), new Date(i).getTime());
              this.weeklyTasks[c].push(data[x]);
            }
            else this.weeklyTasks[c].push('');
          }
          else if (data[x].routine_type == '1') {
            this.weeklyTasks[c].push(data[x]);
          }
          else if (data[x].routine_type == '2') {
            if (data[x].day == new Date(i).getDay()) {
              //console.log('weekly routine');
              this.weeklyTasks[c].push(data[x]);
            }
          }
          else if (data[x].routine_type == '3') {
            if (data[x].date == new Date(i).getDate()) {
              //console.log('monthly routine');
              this.weeklyTasks[c].push(data[x]);
            }
          }
          else if (data[x].routine_type == '4') {
            if (data[x].date == new Date(i).getDate()) {
              //console.log('yearly routine');
              this.weeklyTasks[c].push(data[x]);
            }
          }
        }
      }

      // working rotation
      //console.log(this.weeklyTasks);
      var tempweeklyTasks = this.weeklyTasks[0].map((val, i) => this.weeklyTasks.map((r) => r[r.length - 1 - i]));
      //console.log(tempweeklyTasks);
      this.weeklyTasks1 = tempweeklyTasks;
      //console.log(this.weeklyTasks1.length);

      for (var l = 0; l < 7; l++) {
        for (var m = 0; m < this.weeklyTasks1.length - 1; m++) {
          for (var k = m + 1; k < this.weeklyTasks1.length; k++) {
            if (this.weeklyTasks1[m][l] == '' && this.weeklyTasks1[k][l] != '') {
              var temp = this.weeklyTasks1[m][l];
              this.weeklyTasks1[m][l] = this.weeklyTasks1[k][l]
              this.weeklyTasks1[k][l] = temp;
            }
            if ((this.weeklyTasks1[m][l].prno != '' && this.weeklyTasks1[k][l].prno != '') && (this.weeklyTasks1[m][l].prno > this.weeklyTasks1[k][l].prno)) {
              var temp = this.weeklyTasks1[m][l];
              this.weeklyTasks1[m][l] = this.weeklyTasks1[k][l]
              this.weeklyTasks1[k][l] = temp;
            }
          }
        }
      }

      var maxlength = 0;
      for (var i = 0; i < this.weeklyTasks1.length; i++) {
        var tempcount = 0;
        for (var j = 0; j < this.weeklyTasks1[i].length; j++) {
          if (this.weeklyTasks1[i][j] == '') {
            tempcount++;
          }
          if (tempcount >= 7) {
            maxlength++;
          }
        }
      }

      //console.log(maxlength);
      this.weeklyTasks1.splice(this.weeklyTasks1.length - maxlength, this.weeklyTasks1.length);
      this.http.get("https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/specialdates", { headers: { 'auth-token': localStorage.getItem('auth-token') } }).subscribe((data) => {
        this.specialDates = data;
        this.loading = false;
      });
    });
  }

  currentWeekButton() {
    this.middleDayOfWeek = this.today;
    this.generateTimetable(this.middleDayOfWeek);
  }

  nextWeekButton() {
    this.middleDayOfWeek = new Date(this.middleDayOfWeek.getTime() + 1000 * 60 * 60 * 24 * 7);
    this.generateTimetable(this.middleDayOfWeek);
  }

  previousWeekButton() {
    this.middleDayOfWeek = new Date(this.middleDayOfWeek.getTime() - 1000 * 60 * 60 * 24 * 7);
    this.generateTimetable(this.middleDayOfWeek);
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
    //console.log(task);
    if (task == '' || task == null) {
      return;
    }
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
      this.generateTimetable(this.middleDayOfWeek);
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
