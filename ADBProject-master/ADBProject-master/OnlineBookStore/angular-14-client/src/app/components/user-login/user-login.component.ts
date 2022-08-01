import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/models/user-info.model';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  form: UserDetails = {
    username: null,
    password: null
  };
  isLoginFailed = false;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router, private storageService: StorageService) { }

  submitLoginDetails(): void {
    const data = {
      username: this.form.username,
      password: this.form.password
    };

    this.userService.login(data)
      .subscribe({
        next: (res) => {
          this.storageService.saveUser(res);
          this.redirectToBooksPage();
        },
        error: (e) => {
          this.isLoginFailed = true;
          this.errorMessage = e.error.message;
        }
      });
  }

  redirectToSignUp() {
    this.router.navigate(['sign-up']);
  }

  redirectToBooksPage() {
    this.router.navigate(['books']).then(() => {
      window.location.reload();
    });
  }
}
