import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';


export const authGuard: CanActivateFn = (route, state) => {
    const storage = inject(StorageService);
    const router = inject(Router);

    const isLoggedIn = storage.get('isLoggedIn');

    if (isLoggedIn) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
};
