import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsComponent } from './forms/forms.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { ListingComponent } from './listing/listing.component';
import { LandingComponent } from './landing/landing.component';
import { ViewComponent } from './view/view.component';
import { PrescriptionFormComponent } from './prescription-form/prescription-form.component';
import { ReportFormComponent } from './report-form/report-form.component';

export const routes: Routes = [
    {path: '', redirectTo: '/pmrts', pathMatch: 'full'},
    {path: 'pmrts', component: LandingComponent, title: 'Welcome to PMRTS'}, 
    {path: 'register', component: RegisterComponent, title: 'Register'}, 
    {path: 'login', component: LoginComponent, title: 'Login'},
    {path: 'home', component: MainComponent, title: 'Home',
        children: [
            {path: 'dashboard', component: DashboardComponent, title: 'Dashboard'},
            {path: 'hospitals', component: ListingComponent, title: 'Hospitals'},
            {path: 'hospitals/:id', component: FormsComponent, title: 'Hospitals'},
            {path: 'view/hospitals/:id', component: ViewComponent, title: 'Hospitals'},
            {path: 'labs', component: ListingComponent, title: 'Labs'},
            {path: 'labs/:id', component: FormsComponent, title: 'Labs'},
            {path: 'view/labs/:id', component: ViewComponent, title: 'Labs'},
            {path: 'pharmacies', component: ListingComponent, title: 'Pharmacies'},
            {path: 'pharmacies/:id', component: FormsComponent, title: 'Pharmacies'},
            {path: 'view/pharmacies/:id', component: ViewComponent, title: 'Pharmacies'},
            {path: 'doctors', component: ListingComponent, title: 'Doctors'},
            {path: 'doctors/:id', component: FormsComponent, title: 'Doctors'},
            {path: 'view/doctors/:id', component: ViewComponent, title: 'Doctors'},
            {path: 'pharmacists', component: ListingComponent, title: 'Pharmacists'},
            {path: 'pharmacists/:id', component: FormsComponent, title: 'Pharmacists'},
            {path: 'view/pharmacists/:id', component: ViewComponent, title: 'Pharmacists'},
            {path: 'patients', component: ListingComponent, title: 'Patients'},
            {path: 'patients/:id', component: FormsComponent, title: 'Patients'},
            {path: 'view/patients/:id', component: ViewComponent, title: 'Patients'},
            {path: 'labtechnicians', component: ListingComponent, title: 'Lab Technicians'},
            {path: 'labtechnicians/:id', component: FormsComponent, title: 'Lab Technicians'},
            {path: 'view/labtechnicians/:id', component: ViewComponent, title: 'Lab Technicians'},
            {path: 'reports', component: ListingComponent, title: 'Reports'},
            {path: 'reports/form', component: ReportFormComponent, title: 'Reports'},
            {path: 'reports/:id', component: ReportComponent, title: 'Reports'},
            {path: 'prescriptions', component: ListingComponent, title: 'Prescriptions'},
            {path: 'prescriptions/:id', component: PrescriptionFormComponent, title: 'Prescriptions'},
            {path: 'prescriptions/form', component: PrescriptionFormComponent, title: 'Prescriptions'},
            // {path: 'prescriptions/:id', component: PrescriptionComponent, title: 'Prescriptions'},
            {path: 'forms', component: FormsComponent, title: 'Forms'}
        ]
    },
    {path: '**', redirectTo: '/pmrts'}
];
