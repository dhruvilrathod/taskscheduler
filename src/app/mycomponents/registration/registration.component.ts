import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public registrationForm: FormGroup;
  public isError: boolean = false;
  public error: string = "";
  public loading: boolean = false;
  public successfulRegistration: string = '';

  constructor(
    private formbuilder: FormBuilder,
    private auth: AuthService,
    private titleService: Title
  ) { this.titleService.setTitle('Registration') }

  ngOnInit(): void {
    this.formBuildFunction();
  }

  formBuildFunction(){
    this.registrationForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      mobilenumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]],
      institution_work: [''],
      profilepic: [''],
    });
  }
  submitRegistration(data){
    this.loading = true;
    //console.log(data);
    //console.log(data.value);
    this.auth.registration(data.value).subscribe((success) => {
      //console.log(success);
      this.loading = false;
      this.isError = false;
      this.error = '';
      this.successfulRegistration = success;
    }, (e) => {
      //console.log(e.error.__proto__.constructor.toString());
      if(e.error.__proto__.constructor.toString() == 'function ProgressEvent() { [native code] }') {
        //console.log('if executed');
        this.loading = false;
        this.isError = true;
        this.successfulRegistration = '';
        this.error = 'Something went wrong. Please try again later.';
      }
      else {
        //console.log('else executed');
        this.loading = false;
        this.isError = true;
        this.successfulRegistration = '';
        this.error = e.error;
      }
    });
  }
}
