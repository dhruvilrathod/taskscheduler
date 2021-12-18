import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-mytasks',
  templateUrl: './mytasks.component.html',
  styleUrls: ['./mytasks.component.css']
})
export class MytasksComponent implements OnInit {
  public tasknum: number;
  public fileNames = [];
  public isAttechment = [];
  public today: any;
  public checkBoxValue: string;
  public deleteTaskName: string;
  tasks: any;
  taskEditForm: FormGroup;
  constructor(
    private activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,
    private formbuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formBuildFunction();
    this.getTaskDetails();
    // console.log(this.tasks[2].date.toString() - this.tasks[1].date.toString());
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
  datePickerFunction() {
    var today = new Date();
    var date1 = today.getDate();
    var month1 = today.getMonth() + 1;
    var year1 = today.getFullYear();
    this.today = year1 + '-' + month1 + '-' + date1;
    console.log(this.today);
  }
  getTaskDetails() {
    this.tasks = this.activatedRoute.snapshot.data['myTasksDetails'];
    console.log('from mytasks.components.ts');
    console.log(this.tasks);
    for (var i = 0; i < this.tasks.length; i++) {
      console.log(this.tasks[i].prno);
      if (this.tasks[i].attechment[0].name === "") {
        this.isAttechment[i] = false;
      }
      else {
        this.isAttechment[i] = true;
      }
    }
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
    for (var i = 0; i < this.tasks[tasknumber].attechment.length; i++) {
      if (this.tasks[i].attechment.length === 1 && this.tasks[i].attechment[0].name === "") {
        console.log('if executed');
        this.fileNames = [];
      }
      else {
        this.fileNames = this.tasks[tasknumber].attechment;
      }

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
  sortByFunction(event) {
    console.log("sort by function called");
    console.log(event.target.value);
    switch (event.target.value) {
      case 'highestpriority':
        console.log('highest priority');
        this.tasks.sort(function (x, y) {
          return x.prno - y.prno;
        });
        console.log(this.tasks);
        break;
      case 'lowestpriority':
        console.log('lowest priority');
        this.tasks.sort(function (x, y) {
          return x.prno - y.prno;
        });
        this.tasks.reverse();
        console.log(this.tasks);
        break;
      case 'oldertasks':
        console.log('older tasks');
        break;
      case 'todayonwards':
        console.log('today onwards');
        this.tasks.sort(function (x, y) {
          var x1: any = new Date(x.date);
          var y1: any = new Date(y.date);
          // console.log(x1);
          // console.log(y1);
          console.log(x1-y1);
          if(x1-y1 === 0){
            console.log('if executed');
            return x.prno - y.prno;
          }
          else{
            console.log('else executed');
            return x1 - y1;
          }
        });
        console.log(this.tasks);
        break;
      default:
        console.log('default');
        break;
    }
  }
}
