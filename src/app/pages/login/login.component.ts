import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../app/services/auth';
import { ToastService } from '../../services/toast';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Observable, take } from 'rxjs';
import { loginSuccess } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule, 
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    RouterModule, 
    MatButtonModule],
  providers: [AuthService, ToastService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usuario = {
    cpf: '',
    senha: ''
  }

  loading:boolean = false;

  isLoggedIn:boolean = false;
  private store = inject(Store);
  constructor(private service: AuthService, private router: Router, private toastService:ToastService) {
    this.store.select(state => state.auth?.isLoggedIn).subscribe(
      logged => {
        this.isLoggedIn = logged;
      }
    );
  }

  ngOnInit(): void {
    if(this.isLoggedIn){
        this.router.navigate(['/usuario/lista']);
    }
  }

  login(): void {
    this.loading = true;
    if (!this.usuario.cpf || !this.usuario.senha) {
      this.loading = false;
      this.toastService.show('error', 'Erro!', 'Login e senha são obrigatórios!');
      return;
    }
    this.service.auth_login({login: this.usuario.cpf, senha: this.usuario.senha}) 
      .subscribe({
        next: (response) => {
          if(response.access_token){
            this.loading = false;
            let user =  this.service.decodeJWT(response.access_token);
            this.router.navigate(['/usuario/lista']);
            this.store.dispatch(loginSuccess({ user: user, token: response.access_token || '' }));
          }
        },
        error: (err) => {
          this.loading = false;
          this.toastService.show('error', 'Erro!', err.error.detail || "Ocorreu um erro!")
        }
    })
  }
}