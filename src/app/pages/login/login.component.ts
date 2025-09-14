import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../app/environments/environment';
import { AuthService } from '../../../app/services/auth';
import { ToastService } from '../../services/toast';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from '../../services/storage.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
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

  isLoggedIn:boolean = false;
  private store = inject(Store);
  constructor(private service: AuthService, private toastService:ToastService, private router: Router, private authService: AuthService) {
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
    this.service.auth_login({login: this.usuario.cpf, senha: this.usuario.senha})
  }
}