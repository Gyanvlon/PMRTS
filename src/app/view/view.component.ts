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
  selector: 'app-view',
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
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
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
  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      name: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
      dob: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      orgId: [{ value: '', disabled: true }],
      qualification: [{ value: '', disabled: true }],
      specialization: [{ value: '', disabled: true }],
      experience: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      establishedDate: [{ value: '', disabled: true }],
      registrationNumber: [{ value: '', disabled: true }],
      licenseNumber: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }]
    });

    this.secondFormGroup = this._formBuilder.group({
      addressLine1: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      zipCode: [{ value: '', disabled: true }],
      country: [{ value: '', disabled: true }]
    });
    this.id = this.#routes.snapshot.paramMap.get('id') as string;
    console.log(this.id);
  }
  ngOnInit(): void {
    this.title = localStorage.getItem('title') || '';
    console.log(this.title);
    this.data = localStorage.getItem('state');
    let existingData = JSON.parse(this.data);
    console.log(existingData);
    this.role = JSON.parse(this.data).res.role;
    this.userId = JSON.parse(this.data).res.userId;
    if(this.title == "Patients" || this.title == "Doctors" || this.title == "Labtechnicians" || this.title == "Pharmacists"){
      this.firstFormGroup.patchValue({name: existingData.res.userFullName, email: existingData.res.userEmail});
    }
    //  if(this.role == "DOCTOR" ){  
    //   this.title= "Doctors";
    //   this.#dataService.getHospitals().subscribe( res=> {
    //     this.listOfHospitals = res;
    //     console.log(res);
    //   })
    //  }else if(this.role == "LAB_TECHNICIAN"){
    //   this.title= "Labtechnicians";
    //   this.#dataService.getLabs().subscribe( res=> {
    //     this.listOfLabs = res;
    //     console.log(res);
    //   })
    //  }else if(this.role == "PHARMACIST"){
    //   this.title= "Pharmacists";
    //   this.#dataService.getPharmacies().subscribe( res=> {
    //     this.listOfpharmacies = res;
    //     console.log(res);
    //   })
    //  }else if(this.role == "PATIENT"){
    //   this.title= "Patients";
    //  }
    // this.isUpdate = this.id ?  true : false;
    // console.log(this.id);

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
 
}
