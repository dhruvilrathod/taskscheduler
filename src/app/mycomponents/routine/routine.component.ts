import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.css']
})
export class RoutineComponent implements OnInit {

  addRoutineForm: FormGroup;
  public isButton1Active: boolean = true;
  public isButton2Active: boolean = false;
  public isButton3Active: boolean = false;
  public isButton4Active: boolean = false;
  public isDiv1Active: boolean = true;
  public isDiv2Active: boolean = false;
  public isDiv3Active: boolean = false;
  public isDiv4Active: boolean = false;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.addRoutineForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', Validators.required],
      hour: [''],
      mins: [''],
      ampm: [''],
      description: [''],
    });
    this.showForm1();
  }

  showForm1() {
    console.log('daily function 1 called');
    this.isButton1Active = true;
    this.isButton2Active = false;
    this.isButton3Active = false;
    this.isButton4Active = false;
    this.isDiv1Active = true;
    this.isDiv2Active = false;
    this.isDiv3Active = false;
    this.isDiv4Active = false;
    this.addRoutineForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      hour: ['', Validators.required],
      mins: ['', Validators.required],
      ampm: ['', Validators.required],
      description: [''],
    });
  }

  showForm2() {
    console.log('weekly function 2 called');
    this.isButton1Active = false;
    this.isButton2Active = true;
    this.isButton3Active = false;
    this.isButton4Active = false;
    this.isDiv1Active = false;
    this.isDiv2Active = true;
    this.isDiv3Active = false;
    this.isDiv4Active = false;
    this.addRoutineForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', Validators.required],
      hour: [''],
      mins: [''],
      ampm: [''],
      description: [''],
    });
  }

  showForm3() {
    console.log('monthly function 3 called');
    this.isButton1Active = false;
    this.isButton2Active = false;
    this.isButton3Active = true;
    this.isButton4Active = false;
    this.isDiv1Active = false;
    this.isDiv2Active = false;
    this.isDiv3Active = true;
    this.isDiv4Active = false;
    this.addRoutineForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', Validators.required],
      description: [''],
    });
  }

  showForm4() {
    console.log('yearly function 4 called');
    this.isButton1Active = false;
    this.isButton2Active = false;
    this.isButton3Active = false;
    this.isButton4Active = true;
    this.isDiv1Active = false;
    this.isDiv2Active = false;
    this.isDiv3Active = false;
    this.isDiv4Active = true;
    this.addRoutineForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      month: ['', Validators.required],
      day: ['', Validators.required],
      description: [''],
    });
  }

  addNewRoutine(newRoutine) {
    console.log('submit function called');
    console.log(newRoutine.value);
    this.addRoutineForm.reset();
  }
}
