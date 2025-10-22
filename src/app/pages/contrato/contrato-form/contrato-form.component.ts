import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { InputfileComponent } from '../../../components/inputfile/inputfile.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast';
import { ClientService } from '../../../services/client.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ContratoService } from '../../../services/contrato.service';
import { VendedorService } from '../../../services/vendedor.service';
import { PlanoService } from '../../../services/plano.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ServicoService } from '../../../services/servico.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';



@Component({
  selector: 'app-contrato-form',
  imports: [MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule, 
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    InputfileComponent,
    CommonModule],
  providers:[],
  templateUrl: './contrato-form.component.html',
  styleUrl: './contrato-form.component.scss'
})
export class ContratoFormComponent {
  showSignature = true
  signButtomActive = ''
  id = '';
  valorFormatadoJuros: any = ''
  private typingTimer: any;
  view = false;

  label = {
    nome: 'Nome',
    documento: 'CPF'
  }
  formControls!: FormGroup;
  parcelamentoControls!: FormGroup;
  clienteAssinaturaControls!: FormGroup;
  responsavelAssinaturaControls!: FormGroup;
  anexosList: any = [];
  servicosVinculadosIds: any = [];
  clientControl = new FormControl('');
  clientList: any = []
  clientSelected: any = {}
  loadingClient = false;

  vendedorControl = new FormControl('');
  vendedorList: any = []
  vendedorSelected: any = {}
  loadingVendedor = false;

  planoControl = new FormControl('');
  planoList: any = []
  planoSelected: any = {}
  loadingPlano = false;


  selectedParcela: any = {};
  listOptionsServicos: any = [];
  listOptionsParcelas: any = []

  item = {}
  constructor(
    private route: ActivatedRoute,
    private toast: ToastService, 
    private location: Location,
    private clientService: ClientService,
    private vendedorService: VendedorService,
    private planoService: PlanoService,
    private servicoService: ServicoService,
    private service:  ContratoService) {
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

    this.getServicoList()

    this.formControls = new FormGroup({
      numero: new FormControl(0),
      cliente_id: new FormControl('', Validators.required),
      vendedor_id: new FormControl(''),
      plano_id: new FormControl('', [Validators.required]),
      nome: new FormControl(''),
      documento: new FormControl(''),
    });

    this.parcelamentoControls = new FormGroup({
      id: new FormControl(null),
      data_inicio: new FormControl(null, Validators.required),
      data_fim: new FormControl(null, Validators.required),
      data_vigencia: new FormControl(null),
      meio_pagamento: new FormControl('', Validators.required),
      valor_entrada: new FormControl(0),
      valor_parcela: new FormControl(0, Validators.required),
      valor_total: new FormControl(0, Validators.required),
      taxa_juros: new FormControl(0),
      qtd_parcela: new FormControl(0, Validators.required),
      avista: new FormControl(false),
      data_ultimo_pagamento: new FormControl(null),
      qtd_parcelas_pagas: new FormControl(0),
    });

    this.clienteAssinaturaControls = new FormGroup({
      image: new FormControl(null),
      base64: new FormControl(''),
      descricao: new FormControl(''),
      nome: new FormControl(''),
      tipo: new FormControl('')
    });

    this.responsavelAssinaturaControls = new FormGroup({
      image: new FormControl(null),
      base64: new FormControl(''),
      descricao: new FormControl(''),
      nome: new FormControl(''),
      tipo: new FormControl('')
    });
  }
  
  getUserById(id: string): void{
    this.service.get_by_id(id).subscribe(
        data => {
          this.item = data;

          this.formControls?.patchValue({
            numero: data.documento || '',
            nome: data.nome || '',
            documento: data.documento || '',
          });    

          if(data?.anexos_list){
            this.anexosList = data?.anexos_list
          }
         
          if(data?.parcelamento){
            this.parcelamentoControls?.patchValue({
              id: data?.parcelamento?.id  || null,
              meio_pagamento: data?.parcelamento?.meio_pagamento  || null,
              valor_entrada: data?.parcelamento?.valor_entrada  || null,
              valor_parcela:data?.parcelamento?.valor_parcela  || null,
              valor_total: data?.parcelamento?.valor_total  || null,
              taxa_juros: data?.parcelamento?.taxa_juros  || null,
              qtd_parcela:data?.parcelamento?.qtd_parcela  || null,
              avista: data?.parcelamento?.avista  || null,
              data_ultimo_pagamento: data?.parcelamento?.data_ultimo_pagamento  || null,
              qtd_parcelas_pagas: data?.parcelamento?.qtd_parcelas_pagas  || null,
            });

            if(data?.parcelamento?.data_inicio){
              let dt_inicio = new Date(data?.parcelamento?.data_inicio);
              this.parcelamentoControls?.get("data_inicio")?.setValue(dt_inicio) 
            }

            if(data?.parcelamento?.data_fim){
              let dt_fim = new Date(data?.parcelamento?.data_fim);
              this.parcelamentoControls?.get("data_fim")?.setValue(dt_fim) 
            }
            
            if(data?.parcelamento?.data_vigencia){
              let dt_vigencia = new Date(data?.parcelamento?.data_vigencia);
              this.parcelamentoControls?.get("data_vigencia")?.setValue(dt_vigencia) 
            }
    
            if(data.parcelamento.taxa_juros){
              let juros = parseFloat(data?.parcelamento?.taxa_juros).toFixed(2).toString()
              this.valorFormatadoJuros = `% ${juros}`;
            }
          }

          if(data?.cliente_assinatura){
            this.clienteAssinaturaControls?.patchValue({
              image: data?.cliente_assinatura?.image  || null,
              base64: data?.cliente_assinatura?.base64  || null,
              descricao:  data?.cliente_assinatura?.descricao  || null,
              nome: data?.cliente_assinatura?.nome  || null,
              tipo: data?.cliente_assinatura?.tipo  || null,
            });
          }

          if(data?.responsavel_assinatura){
            this.responsavelAssinaturaControls?.patchValue({
              image: data?.cliente_assinatura?.image  || null,
              base64: data?.cliente_assinatura?.base64  || null,
              descricao: data?.cliente_assinatura?.descricao  || null,
              nome: data?.cliente_assinatura?.nome  || null,
              tipo: data?.cliente_assinatura?.tipo  || null,
            });
          }

          if(data.cliente){
            this.clientSelected = data.cliente;
            this.formControls?.get("cliente_id")?.setValue(data.cliente.id)
          }

          if(data.vendedor){
            this.vendedorSelected = data.vendedor;
            this.formControls?.get("vendedor_id")?.setValue(data.vendedor.id)
          }

          if(data.plano){
            this.planoSelected = data.plano;
            this.formControls?.get("plano_id")?.setValue(data.plano.id)
            
            if(this.planoSelected.numero_parcelas){
              this.servicosVinculadosIds = this.planoSelected?.servicos_vinculados?.map((s : any) => s.id) || [];
              for(let i = 1 ; i <= this.planoSelected.numero_parcelas; i++){
                this.listOptionsParcelas.push({
                  number: i,
                  value: data?.parcelamento?.valor_total / i
                })

                if(data?.parcelamento?.qtd_parcela == i){
                  this.selectedParcela = {
                    number: i,
                    value: data?.parcelamento?.valor_total / i
                  }
                }
              }
            }
          }
        },
        error => {
          this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
              'Contrato não localizado!')
          this.location.back();
        }
    );
  }

  update(): void {
    if (this.formControls.valid && this.parcelamentoControls.valid) {
        let data: any = {
          "cliente_id": this.formControls?.get('cliente_id')?.value,
          "vendedor_id": this.formControls?.get('vendedor_id')?.value || null,
          "plano_id": this.formControls?.get('plano_id')?.value,
          "nome": this.formControls?.get('nome')?.value  || null,
          "documento": this.formControls?.get('documento')?.value  || null,
          parcelamento: this.parcelamentoControls.getRawValue(),
          anexos_list: this.anexosList
        };


      this.service.edit(this.id, data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Contrato atualizado com sucesso!');
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
      this.parcelamentoControls.markAllAsTouched();
      this.toast.show('error', "Erro!",'Preencha todos os campos obrigatórios para concluir o cadastro!');
    }
  }

  create(): void {
    if (this.formControls.valid && this.parcelamentoControls.valid) {
      let data: any = {
        "cliente_id": this.formControls?.get('cliente_id')?.value,
        "vendedor_id": this.formControls?.get('vendedor_id')?.value || null,
        "plano_id": this.formControls?.get('plano_id')?.value,
        "nome": this.formControls?.get('nome')?.value  || null,
        "documento": this.formControls?.get('documento')?.value  || null,
        parcelamento: this.parcelamentoControls.getRawValue(),
        anexos_list: this.anexosList
      };

      this.service.create(data).subscribe(
        data => {
          this.toast.show('success', "Sucesso!",'Contrato criado com sucesso!');
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
      this.parcelamentoControls.markAllAsTouched();
      this.toast.show('error', "Erro!",'Preencha todos os campos obrigatórios para concluir o cadastro!');
    }
  }

  backPage(){
    this.location.back();
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


  /* Selecinar Vendedor */
  searchVendedor(event: any) {
    this.formControls?.get('vendedor_id')?.setValue('')
    this.vendedorSelected = {}
    const input = event?.target?.value;
   this.loadingVendedor = true;
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
      this.findVendedor(input)
      this.loadingVendedor = false;
    }, 2000);
  }
  onVendedorOptionSelected (value: any){
    if(value.id){
      this.formControls?.get('vendedor_id')?.setValue(value.id)
    }
    this.vendedorSelected = value;
  }
  findVendedor(search: string){
    this.loadingVendedor = true;
     this.vendedorService.list_all(search, 1, null, 50).subscribe(
        result => {
           this.loadingVendedor = false;
           this.vendedorList = result?.data ?? []
        },
        error => {
           this.loadingVendedor = false;
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
        }
      );
  }
  displayVendedorName(client: any): string {
    return client ? client.nome : '';
  }

  /* Selecinar Cliente */
  searchClient(event: any) {
    this.formControls?.get('cliente_id')?.setValue('')
    this.clientSelected = {}
    const input = event?.target?.value;
    this.loadingClient = true;
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
       this.findClient(input)
      this.loadingClient = false;
    }, 2000);
  }
  onClientOptionSelected (value: any){
    if(value.id){
      this.formControls?.get('cliente_id')?.setValue(value.id)
    }
    this.clientSelected = value;
  }
  findClient(search: string){
    this.loadingClient = true;
    this.clientService.list_all_clients(search, 1, null, true, 50).subscribe(
      result => {
          this.loadingClient = false;
          this.clientList = result?.data ?? []
      },
      error => {
          this.loadingClient = false;
          this.toast.show('error', "Erro!", error.error.detail || 
            'Ocorreu um erro, tente novamente')
      }
    );
  }
  displayClientName(client: any): string {
    return client ? client.nome : '';
  }

  /* Selecinar Plano */
  searchPlano(event: any) {
    this.formControls?.get('plano_id')?.setValue('')
    this.parcelamentoControls.get('valor_total')?.setValue(0)
    this.parcelamentoControls.get('qtd_parcela')?.setValue(0)
    this.parcelamentoControls.get('valor_parcela')?.setValue(0)
    this.parcelamentoControls.get('avista')?.setValue(false)
    this.parcelamentoControls.get('data_fim')?.setValue(null)
    this.parcelamentoControls.get('data_inicio')?.setValue(null)
    this.parcelamentoControls.get('meio_pagamento')?.setValue(0)
    this.servicosVinculadosIds = [];

    this.planoSelected = {}
    const input = event?.target?.value;
    this.loadingPlano = true;
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
     this.findplano(input)
     this.loadingPlano = false;
    }, 2000);
  }
  onPlanoOptionSelected (value: any){
    if(value.id){
      this.formControls?.get('plano_id')?.setValue(value.id)
    }
    this.planoSelected = value;

    console.log(this.planoSelected)

    this.servicosVinculadosIds = this.planoSelected?.servicos_vinculados?.map((s : any) => s.id) || [];
    this.listOptionsParcelas=[]

    const servicoTotal = this.planoSelected?.servicos_vinculados?.reduce((acc: number, s: any) => {
      return acc + (s.valor || 0);
    }, 0) || 0;

    if(this.planoSelected.valor_total){

      this.parcelamentoControls.get('valor_total')?.setValue(this.planoSelected.valor_total + servicoTotal)

      if(this.planoSelected.numero_parcelas){
        for(let i = 1 ; i <= this.planoSelected.numero_parcelas; i++){
          this.listOptionsParcelas.push({
            number: i,
            value: (this.planoSelected.valor_total + servicoTotal) / i
          })
        }
      }
    }
  }
  findplano(search: string){
    this.loadingPlano = true;
    this.planoService.get_all(search, 1, 100).subscribe(
      result => {
          this.planoList = result?.data ?? []
          this.loadingPlano = false;
      },
      error => {
          this.loadingPlano = false;
          this.toast.show('error', "Erro!", error.error.detail || 
            'Ocorreu um erro, tente novamente')
      }
    );
  }
  displayPlanoName(client: any): string {
    return client ? client.nome : '';
  }

  changeParcelaOption(event: any){
    const p = event?.value;
    this.selectedParcela = p;
    this.parcelamentoControls.get('qtd_parcela')?.setValue(p.number)
    this.parcelamentoControls.get('valor_parcela')?.setValue(p.value)
    this.parcelamentoControls.get('valor_entrada')?.setValue(p.value)
    if(p.number == 1){
      this.parcelamentoControls.get('avista')?.setValue(true)
      this.parcelamentoControls.get('meio_pagamento')?.setValue(`1 vez`)
    }else{
      this.parcelamentoControls.get('avista')?.setValue(false)
      this.parcelamentoControls.get('meio_pagamento')?.setValue(`${p.number} vezes`)
    }
    this.selectedDataInicio()
  }

  selectedDataInicio(){
    const rawDataInicio = this.parcelamentoControls.get('data_inicio')?.value;
    const dataInicio = new Date(rawDataInicio);

    if (isNaN(dataInicio.getTime())) {
      console.warn('Data início inválida:', rawDataInicio);
      return;
    }

    let endDate = this.addMonthsToDate(this.parcelamentoControls.get('data_inicio')?.value, this.parcelamentoControls.get('qtd_parcela')?.value - 1)
    this.parcelamentoControls.get('data_fim')?.setValue(endDate)
  }

  compareParcelas(option1: any, option2: any): boolean {
    return option1 && option2 ? option1.number === option2.number : option1 === option2;
  }

  addMonthsToDate(data: Date, meses: number): Date {
    const newDate = new Date(data);
    newDate.setMonth(newDate.getMonth() + meses);

    if (newDate.getDate() !== data.getDate()) {
      newDate.setDate(0);
    }

    return newDate;
  }


  onFileSelected(event: any, index: number) {
    const file: File = event.target.files[0];
    if (this.anexosList[index]) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
    }
  }
  saveFileBase64(event: any, index: number){
    this.anexosList[index].base64 = event.base64;
    this.anexosList[index].nome = event.name;
    this.anexosList[index].tipo = event.type;
  }
  onDescricaoAnexoChange(event: any, index: number){
    this.anexosList[index].descricao = event;
  }
  addNewFile(){
    this.anexosList.push(
      {
        "image": "",
        "base64": "",
        "descricao": "",
        "nome": "",
        "tipo": "",
        "id": null
      }
    )
  }
  deleteFile(i: number){
    this.anexosList.splice(i, 1)
  }


  blockNegativeJuros(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  onChangeJuros(event: any){
    const input = event.target as HTMLInputElement;
    const value = input?.value;
    let digits = value.replace(/\D/g, '');
    digits = digits.replace(/^0+/, '') || '0';

    while (digits.length < 3) {
      digits = '0' + digits;
    }

    const reais = digits.slice(0, -2);
    const centavos = digits.slice(-2);
    this.valorFormatadoJuros = `% ${parseInt(reais, 10)},${centavos}`;

    const valorDecimal = parseFloat(`${reais}.${centavos}`);

    this.parcelamentoControls.get('taxa_juros')?.setValue(valorDecimal);
  }
}
