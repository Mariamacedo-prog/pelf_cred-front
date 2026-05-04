import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ToastService } from '../../../services/toast';
import { TransacaoService } from '../../../services/transacao.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-inadimplente-form',
  imports: [
    MatPaginatorModule,
    MatIconModule,
    MatTableModule, 
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule, 
    MatButtonModule,
    MatDividerModule,
    TextFieldModule,
    CommonModule
  ],
  templateUrl: './inadimplente-form.component.html',
  styleUrl: './inadimplente-form.component.scss'
})
export class InadimplenteFormComponent {
  length = 1;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  showPageSizeOptions = true;
  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 5,
    length: 0
  }

  id = '';
  displayedColumns: string[] = ['data_hora', 'descricao', 'efetivo', 'meio', 'status', 'valor'];

  contactTypesList: string[] = ['TELEFONE', 'EMAIL', 'OUTRO'];
  statusTypesList: string[] = ['NAO_INICIADA', 'EM_NEGOCIACAO', 'PAGAMENTO_PARCIAL', 'ACORDADO', 'JUDICIAL'];

  loading = true;
  formControls!: FormGroup;
  contactsControls!: FormGroup;
  newContactControls!: FormGroup;
  item = {}
  constructor(
    private route: ActivatedRoute,
    private toast: ToastService, 
    private location: Location,
    private service:  TransacaoService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id){
        this.getTransacaoById(this.id);
      }
    });

    this.formControls = new FormGroup({
      "id": new FormControl(''),
      "contrato_id": new FormControl(''),
      "comprovante_numero": new FormControl(''),
      "status_parcela": new FormControl(''),
      "meio_pagamento": new FormControl(''),
      "status_comprovante": new FormControl(''),
      "data_vencimento": new FormControl(''),
      "data_pagamento": new FormControl(''),
      "anexo_id": new FormControl(''),
      "valor": new FormControl(0),
      "valor_pago": new FormControl(0),
      "numero_parcela": new FormControl(0),
      "created_at": new FormControl(''),
      "updated_at": new FormControl('')
    });

    this.contactsControls = new FormGroup({
      "id": new FormControl(''),
      "contrato": new FormControl({}),
      "total_items": new FormControl(0),
      "total_paginas": new FormControl(0),
      "pagina_atual": new FormControl(1),
      "items": new FormControl(10),
      "offset": new FormControl(0),
      "data": new FormControl([])
    });

    this.newContactControls = new FormGroup({
      "meio": new FormControl('', Validators.required),
      "contrato_id": new FormControl(''),
      "cliente_id": new FormControl(''),
      "data_hora": new FormControl(new Date()),
      "valor": new FormControl(0),
      "descricao": new FormControl('', Validators.required),
      "status": new FormControl('', Validators.required),
      "efetivo": new FormControl(false)
    });
  }
  
  getTransacaoById(id: string): void{
    this.service.get_by_id(id).subscribe(
        data => {
          this.item = data;

          this.formControls?.patchValue({
            "id":  data.id || '',
            "contrato_id":  data.contrato_id || '',
            "comprovante_numero":  data.comprovante_numero || '',
            "status_parcela":  data.status_parcela || '',
            "meio_pagamento":  data.meio_pagamento || '',
            "status_comprovante":  data.status_comprovante || '',
            "data_vencimento":  data.data_vencimento || '',
            "data_pagamento":  data.data_pagamento || '',
            "anexo_id":  data.anexo_id || '',
            "valor":  data.valor || '',
            "valor_pago":  data.valor_pago || '',
            "numero_parcela":  data.numero_parcela || '',
            "created_at":  data.created_at || '',
            "updated_at":  data.updated_at || ''
          });


          this.getContactsInfo(data.contrato_id || '');
        },
        error => {
          this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
              'Transação não localizado!')
          this.location.back();
        }
    );
  }

  getContactsInfo(contractId: string): void{
    if(contractId){
      this.service.get_contacts_by_contrato_id(contractId).subscribe(
        data => {
          this.contactsControls?.patchValue({
            "id": data.id || '',
            "contrato": data.contrato || '',
            "total_items": data.total_items || '',
            "total_paginas": data.total_paginas || '',
            "pagina_atual": data.pagina_atual || '',
            "items": data.items || '',
            "offset": data.offset || '',
            "data": data.data || '',
          });
          this.loading = false;
        },
        error => {
          this.toast.show('error', "Erro!", typeof error?.error?.detail === 'string' ? error.error.detail : 
              'Contatos não localizado!')
          this.loading = false;
        }
      );
    }
  }

  create(): void {
   if (this.newContactControls.valid) {
      let contact: any = {
        meio:  this.newContactControls?.get('meio')?.value,
        descricao: this.newContactControls?.get('descricao')?.value,
        status: this.newContactControls?.get('status')?.value,
        efetivo: this.newContactControls?.get('efetivo')?.value,
        data_hora: new Date(),
        valor: this.formControls?.get('valor')?.value,
        contrato_id: this.formControls?.get('contrato_id')?.value,
        cliente_id: this.contactsControls?.get('contrato')?.getRawValue()?.cliente?.id,
      };

      this.service.create_contact(contact).subscribe(
        data => {
          this.toast.show('success', "Sucesso!",'Contato realizado com sucesso!');
          this.location.back();
        },
        error => {
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
        }
      );
      
    } else {
      this.newContactControls.markAllAsTouched();
      this.toast.show('error', "Erro!",'Preencha todos os campos obrigatórios para concluir o cadastro!');
    }
  }

  handlePageEvent(event: any){
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex =event.pageIndex;
    this.findAllContacts()
  }

  findAllContacts(){
    this.loading = true;

    this.service.get_contacts_by_contrato_id(this.formControls?.get('contrato_id')?.getRawValue(), this.pageIndex + 1, this.pageSize).subscribe(
        result => {
            this.contactsControls?.patchValue({
              "id": result.id || '',
              "contrato": result.contrato || '',
              "total_items": result.total_items || '',
              "total_paginas": result.total_paginas || '',
              "pagina_atual": result.pagina_atual || '',
              "items": result.items || '',
              "offset": result.offset || '',
              "data": result.data || '',
            });

            this.length = result?.total_items ?? 0
            this.loading =false
        },
        error => {
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
            this.loading =false
        }
    );
  }
 
  backPage(){
    this.location.back();
  }
}
