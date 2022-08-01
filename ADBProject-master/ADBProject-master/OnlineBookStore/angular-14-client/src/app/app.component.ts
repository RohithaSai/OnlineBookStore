import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  isAdmin = false;
  username?: string;
  constructor(private userService: UserService, private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.username = user.username;
    }
  }

  logout(): void {
    this.userService.logout().subscribe({
      next: res => {
        this.storageService.clean();
      },
      error: err => {
        console.log(err);
      }
    });
    window.location.reload();
  }
  
}
