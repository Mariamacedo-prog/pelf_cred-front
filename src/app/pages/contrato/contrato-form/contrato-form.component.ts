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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import { SignaturePadComponent } from '../../../components/signature-pad/signature-pad.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { TransacaoService } from '../../../services/transacao.service';
import { MatTableModule } from '@angular/material/table';
import { DialogTransacaoComponent } from '../../../components/dialog-transacao/dialog-transacao.component';


@Component({
  selector: 'app-contrato-form',
  imports: [MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule, 
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    InputfileComponent,
    MatMenuModule,
    DialogTransacaoComponent,
    SignaturePadComponent,
    MatButtonToggleModule,
    MatTableModule],
  providers:[],
  templateUrl: './contrato-form.component.html',
  styleUrl: './contrato-form.component.scss'
})
export class ContratoFormComponent {
  access = 'total';
  showSignature = false
  signButtomActive = ''
  id = '';
  valorFormatadoJuros: any = ''
  valorTotalFormatado: any = ''
  private typingTimer: any;
  view = false;
  maxParcelas = 36;
  label = {
    nome: 'Nome',
    documento: 'CPF'
  }
  formControls!: FormGroup;
  parcelamentoControls!: FormGroup;
  clienteAssinaturaControls!: FormGroup;
  responsavelAssinaturaControls!: FormGroup;
  anexosList: any = [];
  clientControl = new FormControl('');
  clientList: any = []
  clientSelected: any = {}
  loadingClient = false;

  listOptionsPag: any = [
    { label: 'Mensal', value: 'MENSAL'},
    { label: 'Semanal', value: 'SEMANAL'}
  ]

  vendedorControl = new FormControl('');
  vendedorList: any = []
  vendedorSelected: any = {}
  loadingVendedor = false;

  transacoesList: any = []
  displayedTransacoesCol: string[] = ['numero_parcela', 'valor', 'data_vencimento',  'data_pagamento',  'status_parcela',  'actions'];
  transacaoSelected: any = {}
  showModal: boolean = false;
  editModal: boolean = false;

  selectedParcela: any = {};
  listOptionsParcelas: any = [];
  status = {cobranca: null, contrato: null}
  item = {}
  constructor(
    private route: ActivatedRoute,
    private toast: ToastService, 
    private location: Location,
    private clientService: ClientService,
    private vendedorService: VendedorService,
    private transacaoService: TransacaoService,
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

    this.formControls = new FormGroup({
      numero: new FormControl(0),
      cliente_id: new FormControl('', Validators.required),
      vendedor_id: new FormControl(''),
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
      tipo_pagamento: new FormControl(null),
      valor_parcela: new FormControl(0, Validators.required),
      valor_total: new FormControl(0, Validators.required),
      taxa_juros: new FormControl(0),
      qtd_parcela: new FormControl(0, Validators.required),
      avista: new FormControl(false),
      data_ultimo_pagamento: new FormControl(null),
      qtd_parcelas_pagas: new FormControl(0),
    });

    this.clienteAssinaturaControls = new FormGroup({
      id: new FormControl(null),
      image: new FormControl(null),
      base64: new FormControl(''),
      descricao: new FormControl(''),
      nome: new FormControl(''),
      tipo: new FormControl('')
    });

    this.responsavelAssinaturaControls = new FormGroup({
      id: new FormControl(null),
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
            numero: data.numero || '',
            nome: data.nome || '',
            documento: data.documento || '',
          });    

          if(data?.anexos_list){
            this.anexosList = data?.anexos_list
          }

          this.status = {
            cobranca: data.status_cobranca || null, 
            contrato: data.status_contrato || null
          }

          if(data.status_contrato == "ATIVO"){
            this.transacaoService.list_all('', data.id).subscribe(
              data => {
                this.transacoesList = data.data || []
              },
              error => {
                console.log(error, "error")
              }
            )
          }

          if(data.status_contrato == "PENDENTE_ASSINATURA"){
            this.showSignature = true;
          }
         
          if(data?.parcelamento){
            this.parcelamentoControls?.patchValue({
              id: data?.parcelamento?.id  || null,
              meio_pagamento: data?.parcelamento?.meio_pagamento  || null,
              valor_entrada: data?.parcelamento?.valor_entrada  || 0,
              valor_parcela:data?.parcelamento?.valor_parcela  || 0,
              valor_total: data?.parcelamento?.valor_total  || 0,
              taxa_juros: data?.parcelamento?.taxa_juros  || 0,
              qtd_parcela: data?.parcelamento?.qtd_parcela  || null,
              avista: data?.parcelamento?.avista || false,
              tipo_pagamento: data?.parcelamento?.tipo_pagamento  || null,
              data_ultimo_pagamento: data?.parcelamento?.data_ultimo_pagamento  || null,
              qtd_parcelas_pagas: data?.parcelamento?.qtd_parcelas_pagas  || null,
            });
            
          if (data?.parcelamento?.valor_total) {
              this.listOptionsParcelas = [];

              const valorTotal = data.parcelamento.valor_total;
              const taxaJuros = (data?.parcelamento?.taxa_juros || 0) / 100;
              const qtdSelecionada = data.parcelamento.qtd_parcela;

              for (let i = 1; i <= this.maxParcelas; i++) {

                let parcela = valorTotal;

                if (taxaJuros > 0) {
                  const fator = Math.pow(1 + taxaJuros, i);
                  parcela = valorTotal * (taxaJuros * fator) / (fator - 1);
                }

                this.listOptionsParcelas.push({
                  number: i,
                  value: Number(parcela.toFixed(2))
                });

                if (qtdSelecionada === i) {
                  this.selectedParcela = {
                    number: i,
                    value: Number(parcela.toFixed(2))
                  };
                }
              }
            }

         

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

            if(data.parcelamento.valor_total){
              let valor = parseFloat(data?.parcelamento?.valor_total).toFixed(2).toString()
              this.valorTotalFormatado = `R$ ${valor}`;
            }
          }

          if(data?.cliente_assinatura){
            this.clienteAssinaturaControls?.patchValue({
              id: data?.cliente_assinatura?.id  || null,
              image: data?.cliente_assinatura?.image  || null,
              base64: data?.cliente_assinatura?.base64  || null,
              descricao:  data?.cliente_assinatura?.descricao  || null,
              nome: data?.cliente_assinatura?.nome  || null,
              tipo: data?.cliente_assinatura?.tipo  || null,
            });
          }

          if(data?.responsavel_assinatura){
            this.responsavelAssinaturaControls?.patchValue({
              id: data?.responsavel_assinatura?.id  || null,
              image: data?.responsavel_assinatura?.image  || null,
              base64: data?.responsavel_assinatura?.base64  || null,
              descricao: data?.responsavel_assinatura?.descricao  || null,
              nome: data?.responsavel_assinatura?.nome  || null,
              tipo: data?.responsavel_assinatura?.tipo  || null,
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

           this.parcelamentoControls.get('data_fim')?.disable();
          if (this.view || data.status_contrato !== 'INICIADO') {
            this.parcelamentoControls.get('data_inicio')?.disable();  
            this.parcelamentoControls.get('data_vigencia')?.disable();
            this.parcelamentoControls.get('tipo_pagamento')?.disable();
          } else {
            this.parcelamentoControls.get('data_inicio')?.enable();
            this.parcelamentoControls.get('data_vigencia')?.enable();
            this.parcelamentoControls.get('tipo_pagamento')?.enable();
          }
        },
        error => {
          this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
              'Contrato não localizado!')
          this.location.back();
        }
    );
  }

  update(mutuante: any = {}, mutuario: any = {}): void {
    if (this.formControls.valid && this.parcelamentoControls.valid) {
        let data: any = {
          "cliente_id": this.formControls?.get('cliente_id')?.value,
          "vendedor_id": this.formControls?.get('vendedor_id')?.value || null,
          "nome": this.formControls?.get('nome')?.value  || null,
          "documento": this.formControls?.get('documento')?.value  || null,
          parcelamento: this.parcelamentoControls.getRawValue(),
          anexos_list: this.anexosList
        };

      if(mutuante?.base64){
        data.responsavel_assinatura = mutuante;
      }
      
      if(mutuario?.base64){
        data.cliente_assinatura = mutuario;
      }

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

  onValorTotalSelected() {
    let newList = [];

    const valorTotal = this.parcelamentoControls.get('valor_total')?.value || 0;
    const taxaJuros = (this.parcelamentoControls.get('taxa_juros')?.value || 0);
    const valorJuros = valorTotal * (taxaJuros / 100);
    const totalComJuros = valorTotal + valorJuros;
    const maxParcelas = this.maxParcelas;

    for (let i = 1; i <= maxParcelas; i++) {
      let parcela = totalComJuros;

      if (taxaJuros > 0) {
        parcela = totalComJuros / i;
      }

      newList.push({
        number: i,
        value: Number(parcela.toFixed(2))
      });

      if (this.parcelamentoControls.get('qtd_parcela')?.value === i) {
        this.selectedParcela = {
          number: i,
          value: Number(parcela.toFixed(2))
        };
      }
    }

    this.listOptionsParcelas = newList;
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
      return;
    }

    let endDate = this.addMonthsToDate(this.parcelamentoControls.get('data_inicio')?.value, this.parcelamentoControls.get('qtd_parcela')?.value - 1)
    this.parcelamentoControls.get('data_fim')?.setValue(endDate)
  }

  compareParcelas(option1: any, option2: any): boolean {
    return option1 && option2 ? option1.number === option2.number : option1 === option2;
  }

  addMonthsToDate(data: Date, numero: number): Date {
    if(data){
      let newDate = new Date(data);
      /*if (newDate.getDate() !== data.getDate()) {
        newDate.setDate(0);
      } */
      if(this.parcelamentoControls.get('tipo_pagamento')?.value == 'MENSAL'){
        newDate.setMonth(newDate.getMonth() + numero);
      }

      if (this.parcelamentoControls.get('tipo_pagamento')?.value === 'SEMANAL') {
        const novaData = new Date(newDate);

        const diasParaSomar = 7 * numero;

        novaData.setDate(novaData.getDate() + diasParaSomar);
        newDate = novaData;
      }

      return newDate;
    }else{
      return new Date();
    }
  }

  openTransacaoModal(event: any, edit: boolean){
    this.transacaoSelected = event;
    this.showModal = true;
    this.editModal = edit;
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

  blockNegative(event: KeyboardEvent) {
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
    this.selectedParcela = {}
    this.listOptionsParcelas = [];
    this.parcelamentoControls.get('meio_pagamento')?.setValue('');
    this.parcelamentoControls.get('valor_entrada')?.setValue(0);
    this.parcelamentoControls.get('valor_parcela')?.setValue(0);
    this.parcelamentoControls.get('qtd_parcela')?.setValue(0);
    this.parcelamentoControls.get('avista')?.setValue(false);
  }

  onChangeValorTotal(event: any){
    const input = event.target as HTMLInputElement;
    const value = input?.value;
    let digits = value.replace(/\D/g, '');
    digits = digits.replace(/^0+/, '') || '0';

    while (digits.length < 3) {
      digits = '0' + digits;
    }

    const reais = digits.slice(0, -2);
    const centavos = digits.slice(-2);
    this.valorTotalFormatado = `R$ ${parseInt(reais, 10)},${centavos}`;

    const valorDecimal = parseFloat(`${reais}.${centavos}`);
    this.parcelamentoControls.get('valor_total')?.setValue(valorDecimal);
    
    this.selectedParcela = {}
    this.listOptionsParcelas = [];
    this.parcelamentoControls.get('meio_pagamento')?.setValue('');
    this.parcelamentoControls.get('valor_entrada')?.setValue(0);
    this.parcelamentoControls.get('valor_parcela')?.setValue(0);
    this.parcelamentoControls.get('qtd_parcela')?.setValue(0);
    this.parcelamentoControls.get('avista')?.setValue(false);
  }

  receiveSignImage(event: any){
    if(event.base64){
      let anexo = {
        id: null,
        image: null,
        base64: event.base64 || '',
        descricao: `assinatura ${event.nome}` || '',
        nome: `${event.nome}.jpeg` || '',
        tipo: 'image/jpeg'
      }
      if(event.nome == 'MUTUANTE'){
        anexo.id = this.responsavelAssinaturaControls?.get('id')?.value || null,
        this.service.signature_mutuante(this.id, anexo).subscribe(
          result => {
            this.toast.show('success', "Sucesso!",'Contrato retornou para edição!');
            this.location.back();
          },
          error => {
            this.loadingVendedor = false;
              this.toast.show('error', "Erro!", error.error.detail || 
                'Ocorreu um erro, tente novamente')
          }
        );
      } else {
        anexo.id = this.clienteAssinaturaControls?.get('id')?.value || null,
        this.service.signature_mutuario(this.id, anexo).subscribe(
          result => {
            this.toast.show('success', "Sucesso!",'Contrato retornou para edição!');
            this.location.back();
          },
          error => {
            this.loadingVendedor = false;
              this.toast.show('error', "Erro!", error.error.detail || 
                'Ocorreu um erro, tente novamente')
          }
        );
      }
    }
  }


  downloadPdf(){
       this.service.downloadPdf(this.id).subscribe(
        (data: Blob) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `contrato${this.formControls?.get("numero")?.value ? ('_' + this.formControls?.get("numero")?.value) : ''}.pdf`;
            a.click();

            window.URL.revokeObjectURL(url);
        },
        error => {
          this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
              'Ocorreu um erro!')
        }
    );
  }

  downloadWord() {
    this.service.downloadWord(this.id).subscribe((data: Blob) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrato${this.formControls?.get("numero")?.value ? ('_' + this.formControls?.get("numero")?.value) : ''}.docx`;
      a.click();
      window.URL.revokeObjectURL(url)
    },
    error => {
      this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
          'Ocorreu um erro!')
    }
  )}

  sendToSignature() {
    this.service.send_to_signature(this.id).subscribe((res) => {
      this.toast.show('success', "Sucesso!",'Contrato enviado para assinatura!');
      this.location.back();
    },
    error => {
      this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
          'Ocorreu um erro!')
    })
  }

  sendToEdit(){
    this.service.send_to_edict(this.id).subscribe((res) => {
      this.toast.show('success', "Sucesso!",'Contrato retornou para edição!');
      this.location.back();
    },
    error => {
      this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
          'Ocorreu um erro!')
    })
  }

  showEditButton(element: any){

    const firstLine = this.transacoesList.find((t: any) => 
      t.status_parcela === 'EM_ATRASO' || t.status_parcela === 'PAGAMENTO_PARCIAL'
    );

    return firstLine && firstLine.id === element.id;
  }
}
