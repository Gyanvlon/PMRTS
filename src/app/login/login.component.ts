import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { ToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide = signal(true);
  #dataService = inject(DataService);
  #router = inject(Router);
  #toasterService = inject(ToasterService);

  logInForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  logIn() {  
    if (this.logInForm.valid) {
      this.#dataService.logInUser(this.logInForm.value).subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.#dataService.user_signal.set({res});
          localStorage.setItem(
            "state",
            JSON.stringify(this.#dataService.user_signal())
          );
          this.#toasterService.success("User logged in successfully!");
          this.#router.navigate(["/home/dashboard"]);
        } else {
          this.#toasterService.error("Something went wrong!");
        }
      });
    }else{
      this.#toasterService.error("Please enter valid email and password!");
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
