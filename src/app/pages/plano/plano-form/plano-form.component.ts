import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast';
import { PlanoService } from '../../../services/plano.service';
import { ServicoService } from '../../../services/servico.service';

@Component({
  selector: 'app-plano-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule
  ],
  templateUrl: './plano-form.component.html',
  styleUrl: './plano-form.component.scss'
})
export class PlanoFormComponent {
  id = '';
  view = false;
  formControls!: FormGroup;
  item: any = {}
  valorFormatado: any = ''
  valorLabel = 'Valor Mensal'
  listOptions: any = [
    { label: 'À vista', value: 1},
    { label: '2x', value: 2},
    { label: '3x', value: 3},
    { label: '4x', value: 4},
    { label: '5x', value: 5},
    { label: '6x', value: 6},
    { label: '7x', value: 7},
    { label: '8x', value: 8},
    { label: '9x', value: 9},
    { label: '10x', value: 10},
    { label: '11x', value: 11},
    { label: '12x', value: 12},
    { label: '24x', value: 24},
    { label: '36x', value: 36},
  ]

  listOptionsServicos: any = [];
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private toast: ToastService, 
    private location: Location,
    private servicoService: ServicoService,
    private service:  PlanoService) {
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

    this.getServicoList()

    this.formControls = new FormGroup({
      nome: new FormControl('', Validators.required),
      valor_mensal: new FormControl(0, Validators.required ),
      numero_parcelas: new FormControl(0, Validators.required),
      periodo_vigencia: new FormControl('', Validators.required),
      descricao: new FormControl(''),
      avista: new FormControl(false),
      servicos_vinculados: new FormControl([])
    });
    if(this.view){
      this.formControls.get('numero_parcelas')?.disable();
      this.formControls.get('avista')?.disable();
      this.formControls.get('servicos_vinculados')?.disable();
    }
  }
  
  getUserById(id: string): void{
    if(this.view){
      this.formControls.get('numero_parcelas')?.disable();
      this.formControls.get('avista')?.disable();
    }
    this.service.get_by_id(id).subscribe(
      data => {
        this.item = data;
      
        this.formControls?.patchValue({
          nome: data.nome || '',
          valor_mensal: data.valor_mensal || '',
          numero_parcelas: data.numero_parcelas || '',
          periodo_vigencia: data.periodo_vigencia || '',
          descricao: data.descricao || '',
          avista: data.avista,
          servicos_vinculados: data.servicos_vinculados || '',
        });

        if (data.avista){
          this.valorLabel = 'Valor'
        } else {
          this.valorLabel = 'Valor Mensal'
        }
        
        if(data.valor_mensal){
          this.formatarValor(`${parseFloat(data.valor_mensal).toFixed(2)}`)
        }
      },
      error => {
        this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
            'Plano não localizado!')
        this.location.back();
      }
    );
  }

  getServicoList(filtro: string = ''): void{
    this.servicoService.get_all_info(filtro).subscribe(
      result => {
        if(result?.data?.length > 0){
          this.listOptionsServicos = result?.data;
        }
      },
      error => {
        this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
            'Serviços não localizados!');
      }
    );
  }

  update(): void {
    if (this.formControls.valid) {
      let data: any = {
        nome: this.formControls?.get('nome')?.value,
        valor_mensal: this.formControls?.get('valor_mensal')?.value,
        numero_parcelas: this.formControls?.get('numero_parcelas')?.value,
        periodo_vigencia: this.formControls?.get('periodo_vigencia')?.value,
        descricao: this.formControls?.get('descricao')?.value,
        avista: this.formControls?.get('avista')?.value,
        servicos_vinculados: this.formControls?.get('servicos_vinculados')?.value,
      };

      this.service.edit(this.id, data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Plano atualizado com sucesso!');
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
        valor_mensal: this.formControls?.get('valor_mensal')?.value,
        numero_parcelas: this.formControls?.get('numero_parcelas')?.value,
        periodo_vigencia: this.formControls?.get('periodo_vigencia')?.value,
        descricao: this.formControls?.get('descricao')?.value,
        avista: this.formControls?.get('avista')?.value,
        servicos_vinculados: this.formControls?.get('servicos_vinculados')?.value,
      };

      this.service.create(data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Plano criado com sucesso!');
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

  selectParcelas(e: any){
    this.formControls?.get('numero_parcelas')?.setValue(e?.value);
    if(e?.value == 1) {
      this.formControls?.get('avista')?.setValue(true);
      this.formControls?.get('periodo_vigencia')?.setValue("À vista");
      this.valorLabel = 'Valor'
    }else{
      this.formControls?.get('avista')?.setValue(false);
      this.formControls?.get('periodo_vigencia')?.setValue(`${e?.value}x`);
      this.valorLabel = 'Valor Mensal'
    }
  }

  handleAvista(event: MatSlideToggleChange) {
    if(event?.checked) {
      this.formControls?.get('periodo_vigencia')?.setValue("À vista");
      this.formControls?.get('numero_parcelas')?.setValue(1);
      this.valorLabel = 'Valor'
    }else{
      this.valorLabel = 'Valor Mensal'
      if(this.item.numero_parcelas){
        this.formControls?.get('periodo_vigencia')?.setValue(`${this.item.numero_parcelas}x`);
        this.formControls?.get('numero_parcelas')?.setValue(this.item.numero_parcelas);
      }else{
        this.formControls?.get('periodo_vigencia')?.setValue(`2x`);
        this.formControls?.get('numero_parcelas')?.setValue(2);
      }
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

    this.formControls.get('valor_mensal')?.setValue(valorDecimal);
  }

  blockNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }
}
