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
import { MatSelectModule } from '@angular/material/select';
import { CdkStepperModule } from '@angular/cdk/stepper';

@Component({
  selector: 'app-prescription-form',
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
    MatSelectModule,
    CdkStepperModule],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss'
})
export class PrescriptionFormComponent implements OnInit {
  isUpdate = false;
  firstFormGroup: FormGroup;
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
  selecteRenewable = '';
  selectedPatient = '';
  selectedPharmacist = '';
  listOfPatients: any = [];
  listOfPharmacists: any = [];
  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      drugName: ['', Validators.required],
      dosage: ['', Validators.required],
      duration: ['', Validators.required],  
      frequency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      notes: ['', Validators.required],
      status: ['', Validators.required],
      diagnosisCode: ['', Validators.required],
      renewable: ['', Validators.required],
      patientId: ['', Validators.required],
      pharmacistId: ['', Validators.required],
    });
    this.id = this.#routes.snapshot.paramMap.get('id') as string;
  }
  ngOnInit(): void {
    this.title = localStorage.getItem('title') || '';
    let existingData  = localStorage.getItem('state');
    this.data = JSON.parse(existingData || '{}');
    this.#dataService.getPatients().subscribe((res) => {
      console.log(res);    
      this.listOfPatients = res;
    })
    this.#dataService.getPharmacists().subscribe((res) => {
      console.log(res);    
      this.listOfPharmacists = res;
    })
    if(this.id  && this.data.res.role === "DOCTOR"){
      this.#dataService.getPrescriptionById( this.id).subscribe((res: any) => {
        this.firstFormGroup.patchValue(res);
        this.firstFormGroup.patchValue({renewable: res.renewable ? 'Yes' : 'No'});
        this.isUpdate = true;
        console.log(res);
      })
    }
  }
  submit() {
    const date = new Date(this.firstFormGroup.value.startDate);
    const date1 = new Date(this.firstFormGroup.value.endDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year1 = date1.getFullYear();
    const month1 = String(date1.getMonth() + 1).padStart(2, '0');
    const day1 = String(date1.getDate()).padStart(2, '0');
    console.log(this.data);
    let formData = {
      ...this.firstFormGroup.value,
      doctorId: this.data.res.userId,
      renewable: this.firstFormGroup.value.renewable == 'Yes' ? true : false,
      startDate: `${year}-${month}-${day}`,
      endDate: `${year1}-${month1}-${day1}`
    };
  console.log(formData);
   this.#dataService.sendPrescription(formData).subscribe(res => {
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

  update(){
    const date = new Date(this.firstFormGroup.value.startDate);
    const date1 = new Date(this.firstFormGroup.value.endDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year1 = date1.getFullYear();
    const month1 = String(date1.getMonth() + 1).padStart(2, '0');
    const day1 = String(date1.getDate()).padStart(2, '0');
    console.log(this.data);
    let formData = {
      ...this.firstFormGroup.value,
      doctorId: this.data.res.userId,
      renewable: this.firstFormGroup.value.renewable == 'Yes' ? true : false,
      startDate: `${year}-${month}-${day}`,
      endDate: `${year1}-${month1}-${day1}`
    };
    this.#dataService.updatePrescription(this.id, formData ).subscribe(res => {
      if(res){
        this.#toasterService.success("Updated successfully!");
        this.#router.navigate(['/home/dashboard']);
      }else{
        this.#toasterService.error("Something went wrong!");
      }
    });
  }
}
