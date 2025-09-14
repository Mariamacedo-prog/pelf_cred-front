import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../app/environments/environment';
import { AuthService } from '../../../app/services/auth';
import { ToastService } from '../../services/toast';
import { StorageService } from '../../services/storage.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    RouterModule, 
    MatButtonModule],
  providers: [AuthService, ToastService, StorageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usuario = {
    cpf: '',
    senha: ''
  }

  constructor(private service: AuthService, private toastService:ToastService, private router: Router, private storageService: StorageService) {
  }

  ngOnInit(): void {
    const isLoggedIn = this.storageService.get('isLoggedIn');

    if(isLoggedIn){
        this.router.navigate(['/usuario/lista']);
    }
  }

  decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

  login(): void {
    this.service.auth_login({login: this.usuario.cpf, senha: this.usuario.senha}).subscribe({
      next: (response) => {
        if(response.access_token){
          let user = this.decodeJWT(response.access_token);
          this.storageService.set('token', response.access_token)
          this.storageService.set('user', user)
          this.storageService.set('isLoggedIn', true)
          this.router.navigate(['/usuario/lista']);
        }
      },
      error: (err) => {
        this.toastService.show('error', 'Erro!', err.error.detail || "Ocorreu um erro!")
      }
    })
  }
}