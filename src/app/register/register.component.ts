import { Component, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToasterService } from '../services/toaster.service';
import { DataService } from '../services/data.service';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-register',
  imports: [MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterModule,
    MatSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  hide = signal(true);
  selected = '';
  #router = inject(Router)
  #toasterService = inject(ToasterService)
  #dataService = inject(DataService)

  registerForm: FormGroup = new FormGroup({
    fullName: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.email]),
    password: new FormControl("", [Validators.required]),
    role: new FormControl("", [Validators.required]),
    confirmPassword: new FormControl("", [Validators.required])
  },
  { validators: this.passwordsMatchValidator });
  passwordsMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
  register() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.#dataService.registerUser(this.registerForm.value).subscribe((res: any) => {
        if(res){
          this.#dataService.user_signal.set({res});
          localStorage.setItem(
            'state',
            JSON.stringify(this.#dataService.user_signal())
          );
          console.log(res.role);
         this.#toasterService.success("User registered successfully!");
         if(res.role === "DOCTOR" || res.role === "LAB_TECHNICIAN" || res.role === "PHARMACIST" || res.role === "PATIENT" ){
            localStorage.setItem('isFirstTime', 'true');
           this.#router.navigate(['/home/forms']);
         }else{
           this.#router.navigate(['/home/dashboard']);
         }
        }else{
          this.#toasterService.error("Something went wrong!");
        }
      })
    }else{
      this.#toasterService.error("Please enter valid data!");
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
