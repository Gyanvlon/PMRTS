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
  selector: 'app-report-form',
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
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.scss'
})
export class ReportFormComponent implements OnInit {
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
  listOfHospitals : any= [];
  listOfpharmacies: any = [];
  listOfLabs: any = [];
  userId = '';
  isFirstTime = '';
  selectedLab = '';
  selectedPatient = '';
  selectedDoctor = '';
  listOfPatients: any = [];
  listOfPharmacists: any = [];
  listOfDoctors: any = [];
  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      testName: ['', Validators.required],
      testDescription: ['', Validators.required],
      sampleType: ['', Validators.required],
      testResult: ['', Validators.required],
      testUnit: ['', Validators.required],
      normalRange: ['', Validators.required],
      testStatus: ['', Validators.required],
      comments: ['', Validators.required],
      testDate: ['', Validators.required],
      reportGeneratedDate: ['', Validators.required],
      reportGeneratedBy: ['', Validators.required],
      labTechnicianId: ['', Validators.required],
      patientId: ['', Validators.required],
      labId: ['', Validators.required],
      doctorId: ['', Validators.required],
    });
  }

 
  ngOnInit(): void {
    this.title = localStorage.getItem('title') || '';
    this.data = localStorage.getItem('state');
    this.#dataService.getPatients().subscribe((res) => {
      console.log(res);    
      this.listOfPatients = res;
    })
    this.#dataService.getPharmacists().subscribe((res) => {
      console.log(res);    
      this.listOfPharmacists = res;
    })
  }
  submit() {
    localStorage.setItem("isFirstTime", "false");
    let formData = {
      ...this.firstFormGroup.value,
    };
  
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
