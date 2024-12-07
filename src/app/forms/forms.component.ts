import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../services/data.service';
import { ToasterService } from '../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Facility } from '../Shared/Type';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-forms',
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSelectModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit {
  isUpdate = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  #dataService =inject(DataService);
  #toasterService = inject(ToasterService);
  #router = inject(Router);
  #routes = inject(ActivatedRoute);
  title =""
  id = '';
  data :any = ""
  role: String = "";
  selected = '';
  selectedHospital = '';
  selectedLab = '';
  selectedPharmacy = '';
  selectedDepartment = '';
  selectedGender = '';
  listOfHospitals : any= [];
  listOfpharmacies: any = [];
  listOfLabs: any = [];
  userId = '';
  isFirstTime = '';
  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      department: ['', Validators.required],
      orgId: ['', Validators.required],
      qualification: ['', Validators.required],
      specialization: ['', Validators.required],
      experience: ['', Validators.required],
      status: ['', Validators.required],
      establishedDate: ['', Validators.required],
      registrationNumber: [''],
      licenseNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required]
    });
    this.id = this.#routes.snapshot.paramMap.get('id') as string;
    console.log(this.id);
  }
  ngOnInit(): void {
    this.title = localStorage.getItem('title') || '';
    this.isFirstTime = localStorage.getItem('isFirstTime') || '';
    this.data = localStorage.getItem('state');
    let existingData = JSON.parse(this.data);
    console.log(existingData);
    this.role = JSON.parse(this.data).res.role;
    this.userId = JSON.parse(this.data).res.userId;
    if((this.isFirstTime == 'true' && this.role == "DOCTOR") || (this.isFirstTime == 'true' && this.role == "LAB_TECHNICIAN") ||  (this.isFirstTime == 'true' && this.role == "PHARMACIST") || (this.isFirstTime == 'true' && this.role == "PATIENT")) {
     this.firstFormGroup.patchValue({name: existingData.res.userFullName, email: existingData.res.userEmail});
    }
     if(this.role == "DOCTOR" ){  
      this.title= "Doctors";
      this.#dataService.getHospitals().subscribe( res=> {
        this.listOfHospitals = res;
        console.log(res);
      })
     }else if(this.role == "LAB_TECHNICIAN"){
      this.title= "Labtechnicians";
      this.#dataService.getLabs().subscribe( res=> {
        this.listOfLabs = res;
        console.log(res);
      })
     }else if(this.role == "PHARMACIST"){
      this.title= "Pharmacists";
      this.#dataService.getPharmacies().subscribe( res=> {
        this.listOfpharmacies = res;
        console.log(res);
      })
     }else if(this.role == "PATIENT"){
      this.title= "Patients";
     }
    this.isUpdate = this.id ?  true : false;
    console.log(this.id);

    this.#dataService.getDataDetailsById(this.title, this.id).subscribe((res: Facility) => {
      console.log(res);
      this.firstFormGroup.patchValue(res);
      let adddress = {
        addressLine1: res.addressLine1,
        city: res.city,
        state: res.state,
        country: res.country,
        zipCode: res.zipCode,
      }
      this.secondFormGroup.patchValue(adddress);
    })
  }
  submit() {
    localStorage.setItem("isFirstTime", "false");
    let formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
    };
    if(this.id){
      formData = {
        ...formData,
        id: this.id 
      }
    }
    if(this.role == "DOCTOR" || this.role == "LAB_TECHNICIAN" || this.role == "PHARMACIST" || this.role == "PATIENT" ){
      formData = {
        ...formData,
        id: this.userId
      }
    } 
    console.log("===",formData);
  
   this.#dataService.sendData(formData, this.title).subscribe(res => {
      if(res){
       this.#toasterService.success("Saved successfully!");
       this.#router.navigate(['/home/dashboard']);
      }else{
        this.#toasterService.error("Something went wrong!");
      }
    });
  }
  delete(){
    this.#toasterService.success("Deleted successfully!");
    this.#router.navigate(['/home/dashboard']);
    this.#dataService.deleteDataById(this.title, this.id).subscribe(res => {
     console.log(res);
    });
  }
}
