import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  #dataService = inject(DataService);
  count = {
    numberOfHospitals: 0,
    numberOfLabs: 0,
    numberOfPharmacies: 0,
    numberOfPatients: 0,
    numberOfDoctors: 0,	
    numberofLabTechnicians: 0,
    numberOfPharmacists: 0,
    numberOfReports: 0,
    numberOfPrescriptions: 0,
  }

  ngOnInit(): void {
    this.#dataService.getDashboardData().subscribe((res: any) => {  
      this.count.numberOfHospitals = res.hospitals;
      this.count.numberOfLabs = res.labs;
      this.count.numberOfPharmacies = res.pharmacies;
      this.count.numberOfPatients = res.patients;
      this.count.numberOfDoctors = res.doctors;
      this.count.numberofLabTechnicians = res.labTechnicians;
      this.count.numberOfPharmacists = res.pharmacists;
      this.count.numberOfReports = res.reports;
      this.count.numberOfPrescriptions = res.prescriptions
    });
  }
}
