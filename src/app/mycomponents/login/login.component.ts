import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isError: boolean = false;
  public error: string = "";
  public loading: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private titleService: Title
  ) { this.titleService.setTitle('Login') }

  ngOnInit(): void {
    this.formBuildFunction();
  }

  formBuildFunction() {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  submitLogin(data) {
    this.loading = true;
    //console.log(data);
    //console.log(data.value);
    this.auth.login(data.value).subscribe((token) => {
      //console.log(token);
      this.loading = false;
      localStorage.setItem('auth-token', token);
      this.router.navigate(['/home/my-tasks']);
    }, (e) => {
      //console.log(e.error.__proto__.constructor.toString());
      if(e.error.__proto__.constructor.toString() == 'function ProgressEvent() { [native code] }') {
        //console.log('if executed');
        this.loading = false;
        this.isError = true;
        this.error = 'Something went wrong. Please try again later.';
        localStorage.removeItem('auth-token');
        this.router.navigate(['']);        
      }
      else {
        //console.log('else executed');
        this.loading = false;
        this.isError = true;
        this.error = e.error;
        localStorage.removeItem('auth-token');
        this.router.navigate(['']);
      }
    });
  }
}
