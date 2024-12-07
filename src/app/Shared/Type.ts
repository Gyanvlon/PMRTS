export type RegisterData = {
    fullName: string;
    email: string;
    password: string;
    status: boolean;
    role: string;
  };
  export type LoginData = {
    email: string;
    password: string;
  }
  type Address = {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  export type Facility = {
    id?: string,
    orgId?: string;
    gender?: string;
    department?: string;
    qualification?: string;
    specialization?: string;
    experience?: string;
    dob?: string;
    name: string;
    description: string;
    status: string;
    establishedDate: string; 
    registrationNumber: number;
    licenseNumber: string;
    email: string;
    phoneNumber: number;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  export type PeriodicElement = {
    id: string;
    name: string;
    position: number;
    phoneNumber: number;
    email: string;
    date: string;
    action: string;
  }
  export type FacilityData = {
      id: string;
      name: string; 
      description?: string; 
      status: string; 
      establishedDate: string;
      registrationNumber?: string;
      licenseNumber?: string; 
      email: string; 
      phoneNumber: string; 
      addressLine1: string; 
      city: string; 
      state: string; 
      zipCode: string; 
      country: string; 
    }
    