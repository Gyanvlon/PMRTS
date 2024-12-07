import { HttpInterceptorFn } from '@angular/common/http';
import { DataService } from './services/data.service';
import { inject } from '@angular/core';
export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const state = localStorage.getItem('state');
  if (state) {
    const parsedState = JSON.parse(state); 
    const jwt = parsedState?.res?.jwtToken;
    if (jwt) {
      const request = req.clone({
        setHeaders: { Authorization: 'Bearer ' + jwt },
      });
      return next(request);
    }
  }
  return next(req);
}

