import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ValidateService } from '../../../services/validate.service';
import { CepService } from '../../../services/cep.service';
import { ToastService } from '../../../services/toast';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    RouterModule, 
    MatButtonModule,
    MatDividerModule,
    CommonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  formControls!: FormGroup;
  enderecoControls!: FormGroup;
  constructor(private validateService: ValidateService, private cepService: CepService, private router: Router, private toast: ToastService, private userService:  UserService) {
  }

  ngOnInit(): void {
    this.formControls = new FormGroup({
      cpf: new FormControl('', [Validators.required, this.validateService.validateCPF]),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required,  Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]),
      senha: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      confirmSenha: new FormControl('', [Validators.required, this.compararSenhas.bind(this)]),
    });

    this.enderecoControls = new FormGroup({
      cep: new FormControl('', Validators.required),
      rua: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      bairro: new FormControl('', Validators.required),
      complemento: new FormControl(''),
      cidade: new FormControl('', Validators.required),
      uf: new FormControl('', Validators.required),
    });
  }

  crate(): void {
    if (this.formControls.valid && this.enderecoControls.valid) {
      let data = {
        cpf:  this.formControls?.get('cpf')?.value,
        nome: this.formControls?.get('nome')?.value,
        email: this.formControls?.get('email')?.value,
        telefone: this.formControls?.get('telefone')?.value,
        senha: this.formControls?.get('senha')?.value,
        endereco: this.enderecoControls.getRawValue()
      };

      console.log(data)

      
      this.userService.create_user(data).subscribe(
            data => {
              console.log(data);
              this.toast.show('success', "Erro!",'Cep não localizado!');
            },
            error => {
              console.error(error.error.detail);
                this.toast.show('error', "Erro!", error.error.detail || 
                  'Ocorreu um erro, tente novamente')
            }
      );
      
    } else {
      this.formControls.markAllAsTouched();
      this.enderecoControls.markAllAsTouched();
      this.toast.show('error', "Erro!",'Preencha todos os dados!');
    }
  }

  formatarTelefone() {
    console.log(this.formControls.get('telefone')?.value)
    if(this.formControls.get('telefone')?.value){
      let telefone = this.formControls.get('telefone')?.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
          this.formControls.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  buscarEndereco() {
    if(this.enderecoControls?.get('cep')?.value){
      this.limparEndereco();
      if (this.enderecoControls?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(this.enderecoControls?.get('cep')?.value)
          .subscribe(
            data => {
              console.log(data)
              if(!data.erro){
                this.enderecoControls?.get('rua')?.setValue(data.logradouro);
                this.enderecoControls?.get('bairro')?.setValue(data.bairro);
                this.enderecoControls?.get('cidade')?.setValue(data.localidade)
                this.enderecoControls?.get('uf')?.setValue(data.uf)
              }else{
                this.toast.show('error', "Erro!",'Cep não localizado!');
                this.limparEndereco();
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }

  limparEndereco(){
    this.enderecoControls?.get('rua')?.setValue("");
    this.enderecoControls?.get('bairro')?.setValue("");
    this.enderecoControls?.get('cidade')?.setValue("");
    this.enderecoControls?.get('uf')?.setValue("")
  }


  compararSenhas(control: FormControl): { [key: string]: any } | null {
    const confirmSenha = control.value;
    const senha = this.formControls?.getRawValue()?.senha;

    if (senha && confirmSenha && senha !== confirmSenha) {
      return { 'senhasDivergentes': true };
    }

    return null;
  }
}
