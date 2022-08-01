import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/models/user-info.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignUpComponent {

  form: UserDetails = {
    username: null,
    email: null,
    password: null,
    address: null,
    phone: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) { }

  submitUserDetails(): void {
    let roleType;
    if(this.form.username === "admin") {
      roleType = this.form.username
    } else {
      roleType = "user";
    }
    const data = {
      username: this.form.username,
      email: this.form.email,
      password: this.form.password,
      address: this.form.address,
      phone: this.form.phone,
      roles: [roleType]
    };

    this.userService.signup(data)
      .subscribe({
        next: (res) => {
          this.isSuccessful = true;
        },
        error: (e) => {
          this.isSignUpFailed = true;
          this.errorMessage = e.error.message;
        }
      });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }
}
