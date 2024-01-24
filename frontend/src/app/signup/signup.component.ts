import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupResponse } from './signup.interface';
import { SnackbarService } from '../services/snackbar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  username!: string
  password!: string


  constructor(private http: HttpClient, private snackbar: SnackbarService, private router: Router) {
  }

  ngOnInit(): void {
  }

  register() {
    const url = `${environment.serverHost}/register`


    // Making post request to register user
    this.http.post<SignupResponse>(url, { username: this.username, password: this.password }).subscribe(
      response => {
        // Checking if response had any errors
        if (response.errorMessage) {
          this.snackbar.showSnackbar(`Error ${response.statusCode} : ${response.errorMessage}`, true)
          this.username = ""
          this.password = ""
        } else {
          this.snackbar.showSnackbar(`Successfuly registered new user! Redirecting to login page..`, false)
          this.username = ""
          this.password = ""
          setTimeout(() => {
            // Call your method here
            this.redirectToLogin()
          }, 1500);
        }
      }
    );
  }

  redirectToLogin() {
    this.router.navigate(["/login"])
  }
}
