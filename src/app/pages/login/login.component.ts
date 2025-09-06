import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../app/environments/environment';
import { AuthService } from '../../../app/services/auth';
import { ToastComponent } from '../../components/toast/toast.component'

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatCardModule, 
    MatFormFieldModule,
    ToastComponent,
    MatInputModule, 
    MatButtonModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = {
    cpf: '',
    senha: ''
  }

  constructor(private service: AuthService) {}

  ngOnInit(): void {
    console.log(environment.ANGULAR_API)
    console.log(environment.production)
  }

  login(): void {
    const resp = this.service.auth_login({doc: this.usuario.cpf, password: this.usuario.senha}).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!', response);
        // Aqui você pode salvar tokens, navegar, etc.
      },
      error: (err) => {
        console.log(err.error.detail);
      }
    })
    console.log(resp)
  }
}