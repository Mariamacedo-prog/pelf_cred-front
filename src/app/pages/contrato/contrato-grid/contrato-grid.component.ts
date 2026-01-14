import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../services/toast';
import { AuthService } from '../../../services/auth';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { ContratoService } from '../../../services/contrato.service';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-contrato-grid',
  imports: [  CommonModule, 
    MatPaginatorModule,
    MatIconModule,
    FormsModule, 
    MatFormFieldModule, 
    MatTableModule, 
    MatInputModule,
    DialogComponent,
    MatAutocompleteModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule],
  templateUrl: './contrato-grid.component.html',
  styleUrl: './contrato-grid.component.scss'
})
export class ContratoGridComponent {
  access = 'total';
  private typingTimer: any;
  loading = false;

  displayedColumns: string[] = ['numero_contrato', 'cliente', 'plano', 'valor', 'data_inicio', 'data_termino', 'status', 'actions'];
  data = [];
  searchTerm: string = '';
  optionsCity: any = []
  filteredOptions!: Observable<any>;
  items = 1;
  page = 1;
  user = {};

  length = 1;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  showPageSizeOptions = true;
  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  }

  modal = {
    status: false,
    text:'',
    id: null
  }


  constructor( private router: Router, 
    private toast: ToastService, 
    private service: ContratoService, 
    private exportService: ExportService, 
    private authService: AuthService
  ) {
    // this.authService.permissions$.subscribe(perms => {
    //   this.access = perms.usuario;
    // });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  closeModal() {
    this.modal.status = false;
    this.modal.text = '';
    this.modal.id = null;
  }
  
  addNew() {
    this.router.navigate(["/contrato/novo"]);
  }


  ngOnInit(): void {
    this.findAll();
  }

  filterCity(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsCity.filter((option: any) =>
      option.cidade.toLowerCase().includes(filterValue)
  );
  }
  
  find(event:any) {
    this.loading = true;
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
     this.findAll()
    }, 2000);
  }
  
  findAll(){
    this.loading = true;
    this.service.list_all(this.searchTerm, this.pageIndex + 1, this.pageSize).subscribe(
        result => {
            this.loading = false;
            this.data = result?.data ?? []
            this.length = result?.total_items ?? 0
        },
        error => {
          this.loading = false;
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
        }
    );
  }

  viewItem(element: any){
    this.router.navigate(["/contrato/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/contrato/form/" + element.id]);
  }

  deleteItem(){
    if(this.modal.id){
      this.service.delete(this.modal.id).subscribe(
        result => {
            this.toast.show('success', "Sucesso!", result.detail ?? 'Contrato deletado com sucesso!');
            this.findAll();
            this.closeModal()
        },
        error => {
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
        }
      );
    }
    
  }

  clearSearch() {
    this.pageIndex = 0;
    this.searchTerm = '';
     this.findAll();
  }

  handlePageEvent(event: any){
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex =event.pageIndex;
    this.findAll()
  }
  
  openModal(element: any){
    this.modal.status = true;
    this.modal.text = `Confirma a exclusão do contrato "${element?.numero}"?`;
    this.modal.id = element.id;
  }

  generateExcel(): void {
    let payload = [
        {"field": "numero", "header": "Número", "width": 13},
        {"field": "cliente.nome", "header": "Nome Cliente", "width": 40},
        {"field": "cliente.documento", "header": "Documento Cliente", "width": 23},
        {"field": "cliente.email", "header": "Email Cliente", "width": 40},
        {"field": "cliente.telefone", "header": "Telefone Cliente", "width": 22},
        {"field": "cliente.ativo", "header": "Cliente Ativo", "width": 18},
        {"field": "status_cobranca", "header": "Status da Cobrança", "width": 25},
        {"field": "status_contrato", "header": "Status do Contrato", "width": 25},
        {"field": "ativo", "header": "Contrato Ativo", "width": 18},
        {"field": "created_at", "header": "Data de criação", "width": 30},
        {"field": "parcelamento.data_inicio", "header": "Início Parcelamento", "width": 25},
        {"field": "parcelamento.data_fim", "header": "Fim Parcelamento", "width": 25},
        {"field": "parcelamento.meio_pagamento", "header": "Parcelamento", "width": 18},
        {"field": "parcelamento.valor_total", "header": "Valor total", "width": 15},
        {"field": "parcelamento.valor_parcela", "header": "Valor da Parcela", "width": 20},
        {"field": "parcelamento.qtd_parcela", "header": "Quant. Parcelas", "width": 21},
        {"field": "parcelamento.taxa_juros", "header": "Taxa de Juros", "width": 18},
        {"field": "parcelamento.qtd_parcelas_pagas", "header": "Quant. Parcelas Pagas", "width": 25},
        {"field": "parcelamento.data_ultimo_pagamento", "header": "Dt. ultimo pagamento", "width": 25},
        {"field": "parcelamento.tipo_pagamento", "header": "Tipo de pagamento", "width": 25}
    ]
    this.exportService.generate_excel("contratos", payload, { pagina: 1, items: 15000, filtro: this.searchTerm }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contratos.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }
}
