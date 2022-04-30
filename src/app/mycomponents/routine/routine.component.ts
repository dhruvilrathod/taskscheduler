import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.css']
})
export class RoutineComponent implements OnInit {

  public addRoutineForm: FormGroup;
  public isRoutine: boolean = false;
  public routineType1: boolean = true;
  public routineType2: boolean = false;
  public routineType3: boolean = false;
  public routineType4: boolean = false;

  public isSubmitting: boolean = false;
  public errorMessage: string = "";
  public isError = false;
  public submissionSuccessful: boolean = false;
  public loading: boolean = false;


  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private titleService: Title
  ) { this.titleService.setTitle('Add New Routine') }

  ngOnInit(): void {
    this.formBuildFunction();
  }

  formBuildFunction() {
    //console.log('form build function is called');
    this.addRoutineForm = this.formbuilder.group({
      taskname: ['', Validators.required],
      priority: ['', Validators.required],
      hh: [''],
      mm: [''],
      ampm: [''],
      day: [''],
      month: [''],
      date: [''],
      description: [''],
      routine_type: ['1'],
      is_completed: [false]
    });
  }

  showForm1() {
    this.formBuildFunction();
    //console.log('show form called');
    this.routineType1 = true;
    this.routineType2 = false;
    this.routineType3 = false;
    this.routineType4 = false;
    this.addRoutineForm.get('routine_type').setValue('1');
    this.addRoutineForm.get('hh').setValidators(Validators.required);
    this.addRoutineForm.get('mm').setValidators(Validators.required);
    this.addRoutineForm.get('ampm').setValidators(Validators.required);
    this.addRoutineForm.get('day').clearValidators();
    this.addRoutineForm.get('month').clearValidators();
    this.addRoutineForm.get('date').clearValidators();
    this.addRoutineForm.updateValueAndValidity();
  }
  showForm2() {
    this.formBuildFunction();
    //console.log('show form called');
    this.routineType1 = false;
    this.routineType2 = true;
    this.routineType3 = false;
    this.routineType4 = false;
    this.addRoutineForm.get('routine_type').setValue('2');
    this.addRoutineForm.get('hh').clearValidators();
    this.addRoutineForm.get('mm').clearValidators();
    this.addRoutineForm.get('ampm').clearValidators();
    this.addRoutineForm.get('day').setValidators(Validators.required);
    this.addRoutineForm.get('month').clearValidators();
    this.addRoutineForm.get('date').clearValidators();
    this.addRoutineForm.updateValueAndValidity();
  }
  showForm3() {
    this.formBuildFunction();
    //console.log('show form called');
    this.routineType1 = false;
    this.routineType2 = false;
    this.routineType3 = true;
    this.routineType4 = false;
    this.addRoutineForm.get('routine_type').setValue('3');
    this.addRoutineForm.get('hh').clearValidators();
    this.addRoutineForm.get('mm').clearValidators();
    this.addRoutineForm.get('ampm').clearValidators();
    this.addRoutineForm.get('day').clearValidators();
    this.addRoutineForm.get('month').clearValidators();
    this.addRoutineForm.get('date').setValidators(Validators.required);
    this.addRoutineForm.updateValueAndValidity();
  }
  showForm4() {
    this.formBuildFunction();
    //console.log('show form called');
    this.routineType1 = false;
    this.routineType2 = false;
    this.routineType3 = false;
    this.routineType4 = true;
    this.addRoutineForm.get('routine_type').setValue('4');
    this.addRoutineForm.get('hh').clearValidators();
    this.addRoutineForm.get('mm').clearValidators();
    this.addRoutineForm.get('ampm').clearValidators();
    this.addRoutineForm.get('day').clearValidators();
    this.addRoutineForm.get('month').setValidators(Validators.required);
    this.addRoutineForm.get('date').setValidators(Validators.required);
    this.addRoutineForm.updateValueAndValidity();
  }

  resetForm() {
    //console.log('resetForm function is called');
    if (this.routineType1) this.showForm1();
    else if (this.routineType2) this.showForm2();
    else if (this.routineType3) this.showForm3();
    else if (this.routineType4) this.showForm4();
  }

  addNewRoutine(newRoutine) {
    this.isSubmitting = true;
    var newTask = {
      taskname: newRoutine.value.taskname,
      prno: newRoutine.value.priority,
      routine_type: newRoutine.value.routine_type,
      hh: newRoutine.value.hh,
      mm: newRoutine.value.mm,
      ampm: newRoutine.value.ampm,
      day: newRoutine.value.day,
      date: newRoutine.value.date,
      month: newRoutine.value.month,
      is_completed: newRoutine.value.is_completed,
      description: newRoutine.value.description
    };
    // console.log(newTask);
    this.http.post('https://us-central1-smarttaskscheduler.cloudfunctions.net/app/api/tasks/addNewTask', newTask, { headers: { 'auth-token': localStorage.getItem('auth-token') } }).subscribe((data) => {
      console.log(data);
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
}
