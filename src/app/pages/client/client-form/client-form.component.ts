import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ValidateService } from '../../../services/validate.service';
import { CepService } from '../../../services/cep.service';
import { ToastService } from '../../../services/toast';
import { ClientService } from '../../../services/client.service';


@Component({
  selector: 'app-client-form',
  imports: [MatTabsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule, 
    MatButtonModule,
    MatDividerModule,
    CommonModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {
  id = '';
  view = false;
  label = {
    nome: 'Nome',
    documento: 'CPF'
  }
  formControls!: FormGroup;
  enderecoControls!: FormGroup;
  item = {}
  constructor(
    private validateService: ValidateService, 
    private cepService: CepService, 
    private route: ActivatedRoute,
    private toast: ToastService, 
    private location: Location,
    private service:  ClientService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id){
        this.getUserById(this.id);
      }
      if(params['tela'] == 'visualizar'){
        this.view = true;
      }
    });

    this.formControls = new FormGroup({
      documento: new FormControl('', [Validators.required, this.validateService.validateCPForCNPJ]),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required,  Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]),
      grupo_segmento: new FormControl(''),
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
  
  getUserById(id: string): void{
    this.service.get_client_by_id(id).subscribe(
        data => {
          this.item = data;

          this.formControls?.patchValue({
            documento: data.documento || '',
            nome: data.nome || '',
            email: data.email || '',
            telefone: data.telefone || '',
            grupo_segmento: data.grupo_segmento || '',
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

          this.documentoLabel()
        },
        error => {
          this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
              'Cliente não localizado!')
          this.location.back();
        }
    );
  }

  update(): void {
    if (this.formControls.valid && this.enderecoControls.valid) {
      let data: any = {
        documento:  this.formControls?.get('documento')?.value,
        nome: this.formControls?.get('nome')?.value,
        email: this.formControls?.get('email')?.value,
        telefone: this.formControls?.get('telefone')?.value,
        grupo_segmento: this.formControls?.get('grupo_segmento')?.value,
        endereco: this.enderecoControls.getRawValue()
      };

      this.service.edit_client(this.id, data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Cliente/Empresa criada com sucesso!');
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
        documento:  this.formControls?.get('documento')?.value,
        nome: this.formControls?.get('nome')?.value,
        email: this.formControls?.get('email')?.value,
        telefone: this.formControls?.get('telefone')?.value,
        grupo_segmento: this.formControls?.get('grupo_segmento')?.value,
        endereco: this.enderecoControls.getRawValue()
      };

      this.service.create_client(data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!",'Cliente/Empresa criada com sucesso!');
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

  documentoLabel(){
    const value = this.formControls.get('documento')?.value || '';
    const numeric = value.replace(/\D/g, '');
    if(numeric.length > 11){
      this.label = {
        nome: 'Razão Social',
        documento: 'CNPJ'
      }
    }else{
      this.label = {
        nome: 'Nome',
        documento: 'CPF'
      }
    }
  }

  getCnpjInfo(){
    const value = this.formControls.get('documento')?.value || '';
    const numeric = value.replace(/\D/g, '');

    if(numeric.length === 14){
      this.service.get_info_by_cnpj_receita(numeric).subscribe(
        data => {
          if(data.status == 'OK'){
            if(data.nome){
              this.formControls.get('nome')?.setValue(`${data.nome}`);
            }

            if(data.email){
              this.formControls.get('email')?.setValue(`${data.email}`);
            }

            if(data.telefone){
              this.formControls.get('telefone')?.setValue(`${data.telefone}`);
            }

            if(data.cep){
              let cep = data.cep.replace(/\D/g, '');
              this.enderecoControls.get('cep')?.setValue(`${cep}`);
            }

            if(data.cep){
              let cep = data.cep.replace(/\D/g, '');
              this.enderecoControls.get('cep')?.setValue(`${cep}`);
            }

            if(data.bairro){
              this.enderecoControls.get('bairro')?.setValue(`${data.bairro}`);
            }

            if(data.logradouro){
              this.enderecoControls.get('rua')?.setValue(`${data.logradouro}`);
            }

            if(data.uf){
              this.enderecoControls.get('uf')?.setValue(`${data.uf}`);
            }

            if(data.cidade){
              this.enderecoControls.get('cidade')?.setValue(`${data.municipio}`);
            }

            if(data.numero){
              this.enderecoControls.get('numero')?.setValue(`${data.numero}`);
            }

            if(data.complemento){
              this.enderecoControls.get('complemento')?.setValue(`${data.complemento}`);
            }
          } else {
            this.toast.show('error', "Erro!", data.message ? data.message : 
              'Não localizado!')
          }
        },
        error => {
          this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
              'Ocorreu um erro, tente novamente mais tarde!')
        }
      );
    }
  }


  backPage(){
    this.location.back();
  }
}
