import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {
  public tasks: any;
  public prioritySelected: boolean = false;
  public selectedPriority;
  public month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public today = new Date();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
  public nextMonth;
  public previousMonth;
  taskEditForm: FormGroup;
  public tasknum: number;
  public fileNames = [];
  public isAttechment = [];
  public checkBoxValue: string;
  public deleteTaskName: string;

  constructor(
    private formbuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.tasks = [];
    if (this.month + 1 > 11) {
      this.nextMonth = 0;
    }
    else this.nextMonth = this.month + 1;
    if (this.month - 1 < 0) {
      this.previousMonth = 11;
    }
    else this.previousMonth = this.month - 1;
    this.formBuildFunction();
  }

  nextMonthButton() {
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    console.log('next month pressed: ' + this.month_names[this.month] + ', ' + this.year);
    if (this.month + 1 > 11) {
      this.nextMonth = 0;
    }
    else this.nextMonth = this.month + 1;
    if (this.month - 1 < 0) {
      this.previousMonth = 11;
    }
    else this.previousMonth = this.month - 1;
  }

  previousMonthButton() {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    }
    else this.month--;
    console.log('prevoius month button pressed: ' + this.month_names[this.month] + ', ' + this.year);
    if (this.month + 1 > 11) {
      this.nextMonth = 0;
    }
    else this.nextMonth = this.month + 1;
    if (this.month - 1 < 0) {
      this.previousMonth = 11;
    }
    else this.previousMonth = this.month - 1;
  }

  currentMonthButton() {
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
    console.log(this.month);
    console.log(this.year);
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

}
