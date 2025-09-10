import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    RouterModule, 
    MatButtonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  formControls = new FormGroup({
    cpf: new FormControl(''),
    nome: new FormControl(''),
    email: new FormControl(''),
    telefone: new FormControl(''),
    senha: new FormControl(''),
  });

  enderecoControls = new FormGroup({
    rua: new FormControl(''),
    numero: new FormControl(''),
    bairro: new FormControl(''),
    complemento: new FormControl(''),
    cidade: new FormControl(''),
    uf: new FormControl(''),
  });

  handleKeyUp(event: any) {
    console.log(event)
  }

  isFormValid(): boolean {
    console.log("create")
    return true;
  }

  crate(): void {
    console.log("create")
  }
}
