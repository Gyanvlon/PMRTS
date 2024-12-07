import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../Shared/BaseUrl';
import { Facility, LoginData, RegisterData, PeriodicElement, FacilityData } from '../Shared/Type';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  #http = inject(HttpClient);
  organization_signal :any= signal({title:""})
  user_signal :any= signal({id:"", userFullname:"" , userEmail: "", jwtToken: "",  role: "", status: null, expiresIn:null, userId:null})
  constructor() {
    const state = localStorage.getItem("state")
    if(state) {
      const data = JSON.parse(state)
      this.user_signal.set({...data.res})
    }
   }
   isLogin(){
    return this.user_signal().jwt? true: false;
  }
  registerUser(data:RegisterData ){
    let registerData ={
      "userFullName":data.fullName,
      "userEmail": data.email,
      "userPassword": data.password,
      "userStatus": true,
      "role": data.role
    }
    return this.#http.post(`${BASE_URL}/users/register`, registerData)
   }
   logInUser(data:LoginData){
   let dataToSend =  {
      "userEmail": data.email,
       "userPassword": data.password
     }
    return this.#http.post(`${BASE_URL}/users/login`, dataToSend)
   }
   registerHospital(data: Facility){
    const date = new Date(data.establishedDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let dataToSend = {
      "hospitalName": data.name,
      "hospitalDescription": data.description,
      "hospitalStatus": data.status,
      "hospitalEstablishedDate": `${year}-${month}-${day}`,
      "hospitalRegistrationNumber": data.registrationNumber,
      "hospitalLicenseNumber":  data.licenseNumber,
      "hospitalEmail":  data.email,
      "hospitalPhoneNumber": data.phoneNumber,
      "hospitalAddress": {
        "addressLine1": data.addressLine1,
        "city": data.city,
        "state": data.state,
        "country": data.country,
        "zipCode":  data.zipCode
      }
    }
    console.log(dataToSend);
    return this.#http.post(`${BASE_URL}/hospitals`, dataToSend)
   }
   getDashboardData() {
    return forkJoin({
      hospitals: this.#http.get(`${BASE_URL}/hospitals`),
      labs: this.#http.get(`${BASE_URL}/labs`),
      pharmacies: this.#http.get(`${BASE_URL}/pharmacies`),
      doctors: this.#http.get(`${BASE_URL}/doctors`),
      pharmacists: this.#http.get(`${BASE_URL}/pharmacists`),
      patients: this.#http.get(`${BASE_URL}/patients`),
      labTechnicians: this.#http.get(`${BASE_URL}/labtechnicians`),
      reports: this.#http.get(`${BASE_URL}/reports`),
      prescriptions: this.#http.get(`${BASE_URL}/prescriptions`),
    }).pipe(
      map((responses: any) => {
        return {
          hospitals: responses.hospitals.length,
          labs: responses.labs.length,
          pharmacies: responses.pharmacies.length,
          doctors: responses.doctors.length,
          pharmacists: responses.pharmacists.length,
          patients: responses.patients.length,
          labTechnicians: responses.labTechnicians.length,
          reports: responses.reports.length,
          prescriptions: responses.prescriptions.length
        };
      })
    );
  }

   getData(title: string): Observable<PeriodicElement[]> {
    console.log(title);
    let endpoint = '';
    if (title === 'Hospitals') {
      endpoint = `${BASE_URL}/hospitals`;
    } else if (title === 'Labs') {
      endpoint = `${BASE_URL}/labs`;
    } else if (title === 'Pharmacies') {
      endpoint = `${BASE_URL}/pharmacies`;
    }else if (title === 'Patients') {
      endpoint = `${BASE_URL}/patients`;
    }else if (title === 'Doctors') {
      endpoint = `${BASE_URL}/doctors`;
    }else if (title === 'Pharmacists') {
      endpoint = `${BASE_URL}/pharmacists`;
    }else if (title === 'Lab Technicians') {
      endpoint = `${BASE_URL}/labtechnicians`;
    }
    console.log(endpoint);
    return this.#http.get<any[]>(endpoint).pipe(
      map((response) =>
        response.map((item, index) => ({
          id: (item.hospitalId && item.doctorId) ? item.doctorId : item.hospitalId || item.labId || item.pharmacyId || item.patientId || item.doctorId || item.pharmacistId || item.labTechnicianId || 'Unknown',
          name: item.hospitalName || item.labName || item.pharmacyName || item.patientName || item.doctorName || item.pharmacistName || item.labTechnicianName ||  'Unknown',
          position: index + 1,
          phoneNumber: item.hospitalPhoneNumber || item.labPhoneNumber || item.pharmacyPhoneNumber || item.patientPhone || item.doctorPhone || item.pharmacistPhone || item.labTechnicianPhone || 0,
          email: item.hospitalEmail || item.labEmail || item.pharmacyEmail || item.patientEmail ||  item.doctorEmail || item.pharmacistEmail || item.labTechnicianEmail || 'No email',
          date: item.hospitalEstablishedDate || item.labEstablishedDate || item.pharmacyEstablishedDate || item.patientEstablishedDate || item.doctorEstablishedDate || item.pharmacistEstablishedDate || item.labtechnicianEstablishedDate || 'No date',
          action: 'View Details',
        }))
      )
    );
  }
  getPatients(){
    return this.#http.get(`${BASE_URL}/patients`)
  }
  getPharmacists(){
    return this.#http.get(`${BASE_URL}/pharmacists`)    
  }
  getDataDetailsById(title: string, id: string): Observable<Facility> {
    console.log(title, id);
    let endpoint = '';
    if (title === 'Hospitals') {
      endpoint = `${BASE_URL}/hospitals/${id}`;
    } else if (title === 'Labs') {
      endpoint = `${BASE_URL}/labs/${id}`;
    } else if (title === 'Pharmacies') {
      endpoint = `${BASE_URL}/pharmacies/${id}`;
    }else if (title === 'Patients') {
      endpoint = `${BASE_URL}/patients/${id}`;
    }else if (title === 'Doctors') {
      endpoint = `${BASE_URL}/doctors/${id}`;
    }else if (title === 'Pharmacists') {
      endpoint = `${BASE_URL}/pharmacists/${id}`;
    }else if (title === 'Lab Technicians') {
      endpoint = `${BASE_URL}/labtechnicians/${id}`;
    }
    console.log(endpoint);
    return this.#http.get<any>(endpoint).pipe(
      map((response) => this.transformToFacilityData(response))
    );
  }

  private transformToFacilityData(response: any): Facility {
    return {
      id: (response.hospitalId && response.doctorId) ? response.doctorId : response.hospitalId || (response.labId && response.labTechnicianId) ? response.labTechnicianId : response.labId || (response.pharmacyId && response.pharmacistId) ? response.pharmacistId : response.pharmacyId || response.patientId || response.doctorId,
      name: response.hospitalName || response.labName || response.pharmacyName || response.patientName || response.doctorName || response.pharmacistName || response.labTechnicianName,
      description: response.hospitalDescription || response.labDescription || response.pharmacyDescription || response.patientDescription || response.doctorDescription || response.pharmacistDescription || response.labTechnicianDescription,
      status: response.hospitalStatus || response.labStatus || response.pharmacyStatus || response.patientStatus || response.doctorStatus || response.pharmacistStatus || response.labTechnicianStatus,
      establishedDate: response.hospitalEstablishedDate || response.labEstablishedDate || response.pharmacyEstablishedDate,
      registrationNumber: response.hospitalRegistrationNumber || response.labRegistrationNumber || response.registrationNumber ,
      licenseNumber: response.hospitalLicenseNumber || response.labLicenseNumber || response.licenseNumber,
      gender: response.doctorGender || response.pharmacistGender || response.labTechnicianGender || response.patientGender,
      dob: response.patientDob,
      department: response.doctorDepartment || response.pharmacistDepartment || response.labTechnicianDepartment,
      qualification: response.doctorQualification || response.pharmacistQualification || response.labTechnicianQualification,
      specialization: response.doctorSpecialization || response.pharmacistSpecialization || response.labTechnicianSpecialization,
      experience: response.doctorExperience || response.pharmacistExperience || response.labTechnicianExperience,
      orgId: response.hospitalId || response.labId || response.pharmacyId,
      email: response.hospitalEmail || response.labEmail || response.pharmacyEmail || response.patientEmail || response.doctorEmail || response.pharmacistEmail || response.labTechnicianEmail,
      phoneNumber: response.hospitalPhoneNumber || response.labPhoneNumber || response.pharmacyPhoneNumber || response.patientPhone || response.doctorPhone || response.pharmacistPhoneNumber || response.labTechnicianPhoneNumber,
      addressLine1: response.hospitalAddress?.addressLine1 || response.labAddress?.addressLine1 || response.pharmacyAddress?.addressLine1 || response.patientAddress?.addressLine1 || response.doctorAddress?.addressLine1 || response.pharmacistAddress?.addressLine1 || response.labTechnicianAddress?.addressLine1,
      city: response.hospitalAddress?.city || response.labAddress?.city || response.pharmacyAddress?.city || response.patientAddress?.city || response.doctorAddress?.city || response.pharmacistAddress?.city || response.labTechnicianAddress?.city,
      state: response.hospitalAddress?.state || response.labAddress?.state || response.pharmacyAddress?.state || response.patientAddress?.state || response.doctorAddress?.state || response.pharmacistAddress?.state || response.labTechnicianAddress?.state,
      zipCode: response.hospitalAddress?.zipCode || response.labAddress?.zipCode || response.pharmacyAddress?.zipCode || response.patientAddress?.zipCode || response.doctorAddress?.zipCode || response.pharmacistAddress?.zipCode || response.labTechnicianAddress?.zipCode,
      country: response.hospitalAddress?.country || response.labAddress?.country || response.pharmacyAddress?.country || response.patientAddress?.country || response.doctorAddress?.country || response.pharmacistAddress?.country || response.labTechnicianAddress?.country,
    };
  }
  sendPrescription(data: any){
    console.log(data);
    return this.#http.post(`${BASE_URL}/prescriptions`, data)
  }
  getPrescriptions(){
    return this.#http.get<any[]>(`${BASE_URL}/prescriptions`).pipe(
      map((response) =>
        response.map((item, index) => ({
          id: item.prescriptionId,
          name: item.drugName,
          status: item.status,
          diagnosisCode: item.diagnosisCode,
          position: index + 1,
          action: 'View Details',
        }))
      )
    );
  }

    getHospitalById(id: string){
      return this.#http.get(`${BASE_URL}/hospitals/${id}`)
    }
    getPrescriptionById(id: string){
      return this.#http.get(`${BASE_URL}/prescriptions/${id}`)
    }
    updatePrescription(id: string, data: any){
      return this.#http.put(`${BASE_URL}/prescriptions/${id}`, data)
    } 
    updateHospitalById(id: string, data: Facility){
      const date = new Date(data.establishedDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      let dataToSend = {
        "hospitalName": data.name,
        "hospitalDescription": data.description,
        "hospitalStatus": data.status,
        "hospitalEstablishedDate": `${year}-${month}-${day}`,
        "hospitalRegistrationNumber": data.registrationNumber,
        "hospitalLicenseNumber":  data.licenseNumber,
        "hospitalEmail":  data.email,
        "hospitalPhoneNumber": data.phoneNumber,
        "hospitalAddress": {
          "addressLine1": data.addressLine1,
          "city": data.city,
          "state": data.state,
          "country": data.country,
          "zipCode":  data.zipCode
        }
      }
      return this.#http.put(`${BASE_URL}/hospitals/${id}`, dataToSend)
  }
  deleteHospitalById(id: string){
    return this.#http.delete(`${BASE_URL}/hospitals/${id}`)
  }
  getHospitalByName(name: string){
    return this.#http.get(`${BASE_URL}/hospitals/${name}`)
  }
  getHospitalByEmail(email: string){
    return this.#http.get(`${BASE_URL}/hospitals/email/${email}`) 
  }
  getHospitals(){
    return this.#http.get(`${BASE_URL}/hospitals`)
  }
  sendData(data: Facility, title: string){
    const date = new Date(data.establishedDate);
    const year = date.getFullYear();  
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let endpoint = '';
    let dataToSend={}
    if(title==="Labs"){
      endpoint = `${BASE_URL}/${title.toLowerCase()}`;
     dataToSend = {
      "labName": data.name,
      "labDescription": data.description,
      "labStatus": data.status,
      "labEstablishedDate": `${year}-${month}-${day}`,
      "labRegistrationNumber": data.registrationNumber,
      "labLicenseNumber":  data.licenseNumber,
      "labEmail":  data.email,
      "labPhoneNumber": data.phoneNumber,
      "labAddress": {
        "addressLine1": data.addressLine1,
        "city": data.city,
        "state": data.state,
        "country": data.country,
        "zipCode":  data.zipCode
      }
    }
  }else if(title==="Pharmacies"){
    endpoint = `${BASE_URL}/${title.toLowerCase()}`
    dataToSend = {
      "pharmacyName": data.name,
      "pharmacyDescription": data.description,
      "pharmacyStatus": data.status,
      "pharmacyEstablishedDate": `${year}-${month}-${day}`,
      "registrationNumber": data.registrationNumber,
      "licenseNumber":  data.licenseNumber,
      "pharmacyEmail":  data.email,
      "pharmacyPhoneNumber": data.phoneNumber,
      "pharmacyAddress": {
        "addressLine1": data.addressLine1,
        "city": data.city,
        "state": data.state,
        "country": data.country,
        "zipCode":  data.zipCode
      }
    }
    }else if(title==="Hospitals"){
      endpoint = `${BASE_URL}/${title.toLowerCase()}`
      dataToSend = {
        "hospitalName": data.name,
        "hospitalDescription": data.description,
        "hospitalStatus": data.status,
        "hospitalEstablishedDate": `${year}-${month}-${day}`,
        "hospitalRegistrationNumber": data.registrationNumber,
        "hospitalLicenseNumber":  data.licenseNumber, 
        "hospitalEmail":  data.email,
        "hospitalPhoneNumber": data.phoneNumber,
        "hospitalAddress": {
          "addressLine1": data.addressLine1,
          "city": data.city,
          "state": data.state,
          "country": data.country,
          "zipCode":  data.zipCode
        }   
        }
      }else if(title==="Doctors"){
        endpoint = `${BASE_URL}/${title.toLowerCase()}`;
        dataToSend = {  
          "doctorName": data.name,
          "doctorLicense":  data.licenseNumber, 
          "doctorEmail":  data.email,
          "doctorPhone": data.phoneNumber,  
          "doctorGender": data.gender,
          "doctorQualification": data.qualification,
          "doctorExperience": data.experience,
          "doctorSpecialization": data.specialization,
          "doctorDepartment": data.department,
          "hospitalId": data.orgId,
          "doctorAddress": {
            "addressLine1": data.addressLine1,
            "city": data.city,
            "state": data.state,
            "country": data.country,
            "zipCode":  data.zipCode
          }
       }
     }else if(title==="Patients"){
      endpoint = `${BASE_URL}/${title.toLowerCase()}`;
      dataToSend = {  
        "patientName": data.name,
        "patientEmail":  data.email,
        "patientPhone": data.phoneNumber,  
        "patientGender": data.gender,
        "patientDob": data.dob,
        "patientAddress": {
          "addressLine1": data.addressLine1,
          "city": data.city,
          "state": data.state,
          "country": data.country,  
          "zipCode":  data.zipCode
        } 
     }
    }else if(title==="Pharmacists"){
      endpoint = `${BASE_URL}/${title.toLowerCase()}`;
      dataToSend = {  
        "pharmacistName": data.name,
        "pharmacistDescription": data.description,
        "pharmacistStatus": data.status,  
        "pharmacistEmail":  data.email,
        "pharmacistPhone": data.phoneNumber,  
        "pharmacistGender": data.gender,
        "pharmacistQualification": data.qualification,
        "pharmacistExperience": data.experience,  
        "pharmacistSpecialization": data.specialization,
        "pharmacistLicense": data.licenseNumber,
        "pharmacyId": data.orgId,
        "pharmacistAddress": {
          "addressLine1": data.addressLine1,
          "city": data.city,
          "state": data.state,
          "country": data.country,  
          "zipCode":  data.zipCode  
        }     
       }
     }else if(title==="Labtechnicians"){
      endpoint = `${BASE_URL}/${title.toLowerCase()}`;
      dataToSend = {  
        "labTechnicianName": data.name,
        "labTechnicianEmail":  data.email,
        "labTechnicianPhone": data.phoneNumber,  
        "labTechnicianGender": data.gender,
        "labTechnicianQualification": data.qualification,
        "labTechnicianExperience": data.experience,  
        "labTechnicianLicense": data.licenseNumber,
        "labId": data.orgId,
        "labTechnicianAddress": {
          "addressLine1": data.addressLine1,
          "city": data.city,
          "state": data.state,
          "country": data.country,  
          "zipCode":  data.zipCode  
        }     
       }    
      }
    if(data.id){
      return this.#http.put(endpoint+`/${data.id}`, dataToSend)
    }
    return this.#http.post(endpoint, dataToSend)
  }
  getLabs(){
    return this.#http.get(`${BASE_URL}/labs`)
  }
  getLabById(id: string){
    return this.#http.get(`${BASE_URL}/labs/${id}`)
  }
  updateLabById(id: string, data: Facility){
    const date = new Date(data.establishedDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let dataToSend = {
      "labName": data.name,
      "labDescription": data.description,
      "labStatus": data.status,
      "labEstablishedDate": `${year}-${month}-${day}`,
      "labRegistrationNumber": data.registrationNumber,
      "labLicenseNumber":  data.licenseNumber,
      "labEmail":  data.email,
      "labPhoneNumber": data.phoneNumber,
      "labAddress": {
        "addressLine1": data.addressLine1,
        "city": data.city,
        "state": data.state,
        "country": data.country,  
        "zipCode":  data.zipCode
      }
    }
    return this.#http.put(`${BASE_URL}/labs/${id}`, dataToSend)
  }
  deleteDataById(title: string, id: string ){
    return this.#http.delete(`${BASE_URL}/${title.toLowerCase()}/${id}`)
  }

  deleteLabById(id: string){
    return this.#http.delete(`${BASE_URL}/labs/${id}`)
  }
  getLabByName(name: string){
    return this.#http.get(`${BASE_URL}/labs/${name}`)
  }
  getLabByEmail(email: string){
    return this.#http.get(`${BASE_URL}/labs/email/${email}`) 
  }
  registerPharmacy(data: Facility){
    const date = new Date(data.establishedDate);
    const year = date.getFullYear();  
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let dataToSend = {
      "pharmacyName": data.name,
      "pharmacyDescription": data.description,
      "pharmacyStatus": data.status,
      "pharmacyEstablishedDate": `${year}-${month}-${day}`,
      "registrationNumber": data.registrationNumber,
      "licenseNumber":  data.licenseNumber,
      "pharmacyEmail":  data.email,
      "pharmacyPhoneNumber": data.phoneNumber,
      "pharmacyAddress": {
        "addressLine1": data.addressLine1,
        "city": data.city,
        "state": data.state,
        "country": data.country,
        "zipCode":  data.zipCode
      }
    }   
    return this.#http.post(`${BASE_URL}/pharmacies`, dataToSend)
  }
  getPharmacies(){
    return this.#http.get(`${BASE_URL}/pharmacies`)
  }
  getPharmacyById(id: string){
    return this.#http.get(`${BASE_URL}/pharmacies/${id}`)
  }
  updatePharmacyById(id: string, data: Facility){
    const date = new Date(data.establishedDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let dataToSend = {
      "pharmacyName": data.name,
      "pharmacyDescription": data.description,
      "pharmacyStatus": data.status,
      "pharmacyEstablishedDate": `${year}-${month}-${day}`,
      "pharmacyRegistrationNumber": data.registrationNumber,
      "pharmacyLicenseNumber":  data.licenseNumber,
      "pharmacyEmail":  data.email,
      "pharmacyPhoneNumber": data.phoneNumber,
      "pharmacyAddress": {
        "addressLine1": data.addressLine1,
        "city": data.city,
        "state": data.state,
        "country": data.country,
        "zipCode":  data.zipCode
      }
    }   
    return this.#http.put(`${BASE_URL}/pharmacies/${id}`, dataToSend)
  }
  deletePharmacyById(id: string){
    return this.#http.delete(`${BASE_URL}/pharmacies/${id}`)    
  }
  getPharmacyByName(name: string){
    return this.#http.get(`${BASE_URL}/pharmacies/${name}`)
  }
  getPharmacyByEmail(email: string){
    return this.#http.get(`${BASE_URL}/pharmacies/email/${email}`) 
  }
}

 