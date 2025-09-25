import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ValidateService } from '../../../services/validate.service';
import { CepService } from '../../../services/cep.service';
import { ToastService } from '../../../services/toast';
import { VendedorService } from '../../../services/vendedor.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-vendedor-form',
  imports: [MatTabsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule, 
    MatButtonModule,
    MatDividerModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './vendedor-form.component.html',
  styleUrl: './vendedor-form.component.scss'
})
export class VendedorFormComponent {
  id = '';
  view = false;
  formControls!: FormGroup;
  enderecoControls!: FormGroup;
  fotoControls!: FormGroup;
  @ViewChild('fileInput')  fileInput!: ElementRef<HTMLInputElement>;

  item = {}
  constructor(
    private validateService: ValidateService, 
    private cepService: CepService, 
    private route: ActivatedRoute,
    private toast: ToastService, 
    private location: Location,
    private service: VendedorService) {
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
      cpf: new FormControl('', [Validators.required, this.validateService.validateCPF]),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required,  Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]),
      rg: new FormControl('',  {
        validators: [this.validateService.validateRG],
        nonNullable: true
      })
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

    this.fotoControls = new FormGroup({
      image: new FormControl(''),
      base64: new FormControl(''),
      descricao: new FormControl(''),
      nome: new FormControl(''),
      tipo: new FormControl(''),
    });
  }

  onSelectPicture(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file: File = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      this.fotoControls?.patchValue({
        image: '',
        base64: base64 || '',
        descricao: '',
        nome: file.name || '',
        tipo: file.type || '',
      });
    };

    reader.readAsDataURL(file);
  }

  cleanPicture(){
    this.fotoControls?.patchValue({
        image: '',
        base64:  '',
        descricao: '',
        nome:  '',
        tipo: '',
    });
  }

  openFileSelector(){
    this.fileInput.nativeElement.click();
  }
  
  getUserById(id: string): void{
    this.service.get_client_by_id(id).subscribe(
        data => {
          this.item = data;

          this.formControls?.patchValue({
            cpf: data.cpf || '',
            nome: data.nome || '',
            email: data.email || '',
            telefone: data.telefone || '',
            rg: data.rg || '',
          });

          if(data.endereco){
            this.enderecoControls?.patchValue({
              cep: data.endereco.cep || '',
              numero: data.endereco.numero || '',
              complemento: data.endereco.complemento || '',
              rua: data.endereco.rua || '',
              bairro: data.endereco.bairro || '',
              cidade: data.endereco.cidade || '',
              uf: data.endereco.uf || '',
            });
          }

          if(data.foto){
            this.fotoControls?.patchValue({
              image: data.foto.image || '',
              base64: data.foto.base64 || '',
              descricao: data.foto.descricao || '',
              nome: data.foto.nome || '',
              tipo: data.foto.tipo || '',
            });
          }
        },
        error => {
          this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
              'Vendedor não localizado!')
          this.location.back();
        }
    );
  }

  update(): void {
    if (this.formControls.valid && this.enderecoControls.valid) {
      let data: any = {
        cpf:  this.formControls?.get('cpf')?.value,
        nome: this.formControls?.get('nome')?.value,
        email: this.formControls?.get('email')?.value,
        telefone: this.formControls?.get('telefone')?.value,
        rg: this.formControls?.get('rg')?.value,
        endereco: this.enderecoControls.getRawValue(),
        foto: this.fotoControls.getRawValue()
      };

      this.service.edit(this.id, data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Vendedor atualizada com sucesso!');
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
      this.toast.show('error', "Erro!",'Preencha todos os campos obrigatórios para concluir o cadastro!');
    }
  }

  create(): void {
    if (this.formControls.valid && this.enderecoControls.valid) {
      let data: any = {
        cpf:  this.formControls?.get('cpf')?.value,
        nome: this.formControls?.get('nome')?.value,
        email: this.formControls?.get('email')?.value,
        telefone: this.formControls?.get('telefone')?.value,
        rg: this.formControls?.get('rg')?.value,
        endereco: this.enderecoControls.getRawValue()
      };

      if(this.fotoControls?.get('base64')?.value.length > 0){
        data.foto = this.fotoControls.getRawValue()
      }

      this.service.create_client(data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!",'Vendedor criada com sucesso!');
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
      this.toast.show('error', "Erro!",'Preencha todos os campos obrigatórios para concluir o cadastro!');
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



  backPage(){
    this.location.back();
  }
}
