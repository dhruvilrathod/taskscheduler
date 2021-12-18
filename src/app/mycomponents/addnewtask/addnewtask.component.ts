import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addnewtask',
  templateUrl: './addnewtask.component.html',
  styleUrls: ['./addnewtask.component.css']
})

export class AddnewtaskComponent implements OnInit {
  fileNames = [];
  addTaskForm: FormGroup;
  public submitting: boolean = false;
  public specialDates: any;
  public today: any;
  public isSpecialDate: boolean = false;
  public selectedDate: number;
  public selectedMonth: string;
  public selectedYear: number;
  public occasion: string;
  public dropMessage: string = "Drop Files Here";
  public isDragOver: boolean;
  public isDragEnter: boolean;
  public isDragLeave: boolean;
  public isDropped: boolean;

  constructor(
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formBuildFunction();
    this.datePickerFunction();
  }

  formBuildFunction(){
    console.log('form build function is called');
    this.addTaskForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      date: ['', Validators.required],
      description: [''],
      attechment: []
    });
  }

  onFileSelected(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      var selectedFile = event.target.files[i];
      this.fileNames.push(selectedFile);
    }
    console.log(this.fileNames);
    this.dropMessage ="";
  }
  
  resetForm() {
    console.log('resetForm function is called');
    this.formBuildFunction();
    this.fileNames = [];
    this.isSpecialDate = false;
    this.dropMessage = "Drop Files Here";
    this.isDropped = false;
    this.isDragEnter = false;
    this.isDragLeave = false;
    this.isDragOver = false;
  }

  // working function

  addNewTask(newTaskData) {
    console.log(this.fileNames);
    console.log(newTaskData.value);
    newTaskData.value.attechment = this.fileNames;
    console.log(newTaskData.value.attechment);
    this.submitting = true;
    this.submitting = false;
    console.log('if statement inside for loop' + this.submitting);
    this.fileNames = [];
    this.resetForm();
    newTaskData.reset();
  }
  //assumption:
  // this function is changing the global variable value once it completely finish execution.

  onDrop(event: any){
    console.log("file dropped function is called.");
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    this.dropMessage ="";
    this.isDropped = true;
    this.isDragEnter = false;
    this.isDragLeave = false;
    this.isDragOver = false;
    for (var i = 0; i < event.dataTransfer.files.length; i++) {
      var selectedFile = event.dataTransfer.files[i];
      this.fileNames.push(selectedFile);
    }
    console.log(this.fileNames);
    this.dropMessage ="";
  }
  dragenter(event: any){
    console.log('drag enter is called');
    event.preventDefault();
    this.isDropped = false;
    this.isDragEnter = true;
    this.isDragLeave = false;
    this.isDragOver = false;
    // document.getElementById('dropDiv').classList.add('bg-info');
  };
  dragleave(event: any){
    console.log('drag leave is called');
    event.preventDefault();
    this.isDropped = false;
    this.isDragEnter = false;
    this.isDragLeave = true;
    this.isDragOver = false;
    // document.getElementById('dropDiv').classList.remove('bg-info');
  };
  dragover(event: any){
    console.log('drag over is called');
    event.preventDefault();
    this.isDropped = false;
    this.isDragEnter = false;
    this.isDragLeave = false;
    this.isDragOver = true;
  };

  removeFile(i) {
    console.log('file to remove: ' + this.fileNames[i].name);
    this.fileNames.splice(i, 1);
    if(this.fileNames.length === 0){
      this.dropMessage = "Drop Files Here";
    }
  }

  datePickerFunction(){
    console.log('date piker function is called');
    var today = new Date();
    var date1 = ('0' + today.getDate().toString()).slice(-2);
    // console.log(date1); 
    var month1 = ('0' + (today.getMonth() + 1).toString()).slice(-2);
    // console.log(month1);
    var year1 = today.getFullYear();
    this.today = year1 + '-' + month1 + '-' + date1;
    // console.log(this.today);
  }

  checkSpecialDate(tdate) {
    console.log(tdate.value);
    var d1 = new Date(tdate.value);
    console.log('selected date: ' + d1.toString());
    this.specialDates = this.activatedRoute.snapshot.data['specialDates'];
    console.log(this.specialDates);
    console.log(this.specialDates.length);

    // console.log('a =' + this.specialDates[0].date);

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'October', 'November', 'December'];
    this.selectedDate = d1.getDate();
    this.selectedMonth = months[d1.getMonth()];
    this.selectedYear = d1.getFullYear();
    for (var i = 0; i < this.specialDates.length; i++) {
      var d2 = new Date(this.specialDates[i].year, this.specialDates[i].month, this.specialDates[i].date, 5, 30, 0)
      // console.log(d2);
      if (d1.toString() === d2.toString()) {
        console.log(d2);
        console.log(this.selectedDate);
        console.log(this.selectedMonth);
        console.log(this.selectedYear);
        console.log(this.occasion);
        this.isSpecialDate = true;
        console.log('if ' + this.isSpecialDate);
        this.occasion = this.specialDates[i].occasion;
        return this.isSpecialDate;
      }
      else {
        this.isSpecialDate = false;
        console.log('else ' + this.isSpecialDate);
      }
    }
  }

}


