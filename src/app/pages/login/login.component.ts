import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = {
    cpf: '',
    senha: ''
  }

  constructor() {}
  ngOnInit(): void {

  }

  login(): void {
    console.log("login", this.usuario)
  }
}