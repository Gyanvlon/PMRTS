import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  #toaster = inject(ToastrService)
  constructor() { }
 
  success(message: string, title?: string) {
    this.#toaster.success(message, title);
  }
 
  error(message: string, title?: string) {
    this.#toaster.error(message, title);
  }
 
  warning(message: string, title?: string) {
    this.#toaster.warning(message, title);
  }
 
  info(message: string, title?: string) {
    this.#toaster.info(message, title);
  }
}
