import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast';
import { ServicoService } from '../../../services/servico.service';

@Component({
  selector: 'app-servico-form',
     imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './servico-form.component.html',
  styleUrl: './servico-form.component.scss'
})
export class ServicoFormComponent {
id = '';
  view = false;
  formControls!: FormGroup;
  item: any = {}
  valorFormatado: any = ''
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private toast: ToastService, 
    private location: Location,
    private service:  ServicoService) {
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
      nome: new FormControl('', Validators.required),
      valor: new FormControl(0, Validators.required ),
      categoria: new FormControl(''),
      descricao: new FormControl('')
    });
  }
  
  getUserById(id: string): void{
    this.service.get_by_id(id).subscribe(
      data => {
        this.item = data;
      
        this.formControls?.patchValue({
          nome: data.nome || '',
          valor: data.valor || '',
          categoria: data.categoria || '',
          descricao: data.descricao || ''
        });

        
        if(data.valor){
          this.formatarValor(`${parseFloat(data.valor).toFixed(2)}`)
        }
      },
      error => {
        this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
            'Serviço não localizado!')
        this.location.back();
      }
    );
  }

  update(): void {
    if (this.formControls.valid) {
      let data: any = {
        nome: this.formControls?.get('nome')?.value,
        valor: this.formControls?.get('valor')?.value,
        descricao: this.formControls?.get('descricao')?.value,
        categoria: this.formControls?.get('categoria')?.value
      };
      this.service.edit(this.id, data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Serviço atualizado com sucesso!');
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
      this.toast.show('error', "Erro!",'Preencha todos os campos obrigatórios para concluir o cadastro!');
    }
  }

  create(): void {
    if (this.formControls.valid) {
      let data: any = {
        nome: this.formControls?.get('nome')?.value,
        valor: this.formControls?.get('valor')?.value,
        descricao: this.formControls?.get('descricao')?.value,
        categoria: this.formControls?.get('categoria')?.value
      };

      this.service.create(data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Serviço criado com sucesso!');
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
      this.toast.show('error', "Erro!",'Preencha todos os campos obrigatórios para concluir o cadastro!');
    }
  }

  backPage(){
    this.location.back();
  }

  onChangeValor(event: any){
    const input = event.target as HTMLInputElement;
    const value = input?.value;
    this.formatarValor(value)
  }

  formatarValor(value: string): void {
    let digits = value.replace(/\D/g, '');
    digits = digits.replace(/^0+/, '') || '0';

    while (digits.length < 3) {
      digits = '0' + digits;
    }

    const reais = digits.slice(0, -2);
    const centavos = digits.slice(-2);
    this.valorFormatado = `${parseInt(reais, 10)},${centavos}`;

    const valorDecimal = parseFloat(`${reais}.${centavos}`);
    this.valorFormatado = `${reais}.${centavos}`;

    this.formControls.get('valor')?.setValue(valorDecimal);
  }

  blockNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }
}
