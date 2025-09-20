import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import { CommonModule, Location } from '@angular/common';
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
  id = '';
  view = false;
  formControls!: FormGroup;
  enderecoControls!: FormGroup;
  item = {}
  constructor(
    private validateService: ValidateService, 
    private cepService: CepService, 
    private router: Router, 
    private route: ActivatedRoute,
    private toast: ToastService, 
    private location: Location,
    private userService:  UserService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.id = params['id'];

       if(this.id){
          this.getUserById(this.id)
       }

       if(params['tela'] == 'visualizar'){
        this.view = true;
       }
    });

    this.formControls = new FormGroup({
      cpf: new FormControl('', [Validators.required, this.validateService.validateCPF]),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required,  Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]),
      senha: new FormControl('', this?.id ? [] : [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      confirmSenha: new FormControl('', this?.id ? [] : [Validators.required, this.compararSenhas.bind(this)]),
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

    const senhaControl = this.formControls.get('senha');
    const confirmSenhaControl = this.formControls.get('confirmSenha');

    senhaControl?.valueChanges.subscribe((senha) => {
      if (senha && senha.length > 0) {
        senhaControl.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        ]);

        confirmSenhaControl?.setValidators([
          Validators.required,
          Validators.minLength(8),
          this.compararSenhas.bind(this)
        ]);
      } else {
        senhaControl.clearValidators();
        confirmSenhaControl?.clearValidators();
      }

      senhaControl.updateValueAndValidity();
      confirmSenhaControl?.updateValueAndValidity();
    });
  }
  
  getUserById(id: string): void{
    this.userService.get_user_by_id(id).subscribe(
          data => {
            this.item = data;

            this.formControls?.patchValue({
              cpf: data.cpf || '',
              nome: data.nome || '',
              email: data.email || '',
              telefone: data.telefone || '',
              senha: '',
              confirmSenha: '',
            });

            this.enderecoControls?.patchValue({
              cep: data?.endereco?.cep || '',
              numero: data?.endereco?.numero || '',
              complemento: data?.endereco?.complemento || '',
              rua: data?.endereco?.rua || '',
              bairro: data?.endereco?.bairro || '',
              cidade: data?.endereco?.cidade || '',
              uf: data?.endereco?.uf || '',
            });

            this.formatarTelefone();
            this.formatarCpf();
          },
          error => {
            this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
                'Usuario não localizado!')
            this.location.back();
          }
    );
  }

  update(): void {
    if (this.formControls.valid && this.enderecoControls.valid) {
      let data: any = {
        cpf:  this.formControls?.get('cpf')?.value.replace(/\D/g, ''),
        nome: this.formControls?.get('nome')?.value,
        email: this.formControls?.get('email')?.value,
        telefone: this.formControls?.get('telefone')?.value.replace(/\D/g, ''),
        endereco: this.enderecoControls.getRawValue()
      };

      if(this.formControls?.get('senha')?.value?.length > 0){
          if(this.formControls?.get('senha')?.value == this.formControls?.get('confirmSenha')?.value){
            data.senha = this.formControls?.get('senha')?.value;
          }else{
            this.toast.show('error', "Erro!",'Senhas não batem.');
            return;
          }
      }

      this.userService.edit_user(this.id, data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Usuário criado com sucesso!');
          this.location.back();
        },
        error => {
          console.error(error.error.detail);
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
        }
      );
    }else{
      this.formControls.markAllAsTouched();
      this.enderecoControls.markAllAsTouched();
      this.toast.show('error', "Erro!",'Preencha todos os dados!');
    }
  }

  create(): void {
    if (this.formControls.valid && this.enderecoControls.valid) {
      let data = {
        cpf:  this.formControls?.get('cpf')?.value.replace(/\D/g, ''),
        nome: this.formControls?.get('nome')?.value,
        email: this.formControls?.get('email')?.value,
        telefone: this.formControls?.get('telefone')?.value.replace(/\D/g, ''),
        senha: this.formControls?.get('senha')?.value,
        endereco: this.enderecoControls.getRawValue()
      };

      this.userService.create_user(data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!",'Usuário criado com sucesso!');
          this.location.back();
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
    if(this.formControls.get('telefone')?.value){
      let telefone = this.formControls.get('telefone')?.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
          this.formControls.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  formatarCpf() {
    if(this.formControls.get('cpf')?.value){
      let cpf = this.formControls.get('cpf')?.value.replace(/\D/g, '');

      if (cpf.length === 11) {
        this.formControls.get('cpf')?.setValue(`${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`);
      } else {
          this.formControls.get('cpf')?.setValue(cpf);
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
              if(!data.erro){
                this.enderecoControls?.patchValue({
                  rua: data.logradouro,
                  bairro: data.bairro,
                  cidade: data.localidade,
                  uf: data.uf
                });
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
     this.enderecoControls?.patchValue({
      rua: '',
      bairro: '',
      cidade: '',
      uf: '',
    });
  }


  compararSenhas(control: FormControl): { [key: string]: any } | null {
    const confirmSenha = control.value;
    const senha = this.formControls?.getRawValue()?.senha;

    if (senha && confirmSenha && senha !== confirmSenha) {
      return { 'senhasDivergentes': true };
    }

    return null;
  }

  backPage(){
    this.location.back();
  }
}
