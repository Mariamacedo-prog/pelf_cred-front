import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../services/toast';
import { AuthService } from '../../../services/auth';
import { Observable } from 'rxjs';
import { TransacaoService } from '../../../services/transacao.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { BoxTotalizadoComponent } from '../../../components/box-totalizado/box-totalizado.component';

@Component({
  selector: 'app-dashboard-grid',
    imports: [  CommonModule, 
    MatPaginatorModule,
    MatIconModule,
    FormsModule, 
    MatFormFieldModule, 
    MatTableModule,
    MatSelectModule,
    MatCardModule,
    BoxTotalizadoComponent,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule],
  templateUrl: './dashboard-grid.component.html',
  styleUrl: './dashboard-grid.component.scss'
})
export class DashboardGridComponent {
  access = 'total';
  private typingTimer: any;
  loading = false;

  displayedColumns: string[] = ['numero_parcela', 'valor', 'data_vencimento',  'data_pagamento',  'status_parcela',  'actions'];;
  data = [];
  searchTerm: string = '';
  optionsCity: any = []
  filteredOptions!: Observable<any>;
  items = 1;
  page = 1;
  user = {};
  totalizador: any = []
  listOptionsStatus: any = [
    { label: 'GERADO', value: 'GERADO'},
    { label: 'EM_ATRASO', value: 'EM_ATRASO'},
    { label: 'PAGA', value: 'PAGA'},
    { label: 'PAGAMENTO_PARCIAL', value: 'PAGAMENTO_PARCIAL'}
  ]

  length = 1;
  pageSize = 5;
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
     private service: TransacaoService,
    private authService: AuthService
  ) {
    // this.authService.permissions$.subscribe(perms => {
    //   this.access = perms.usuario;
    // });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  ngOnInit(): void {
    this.findAll();
    this.findTotal();
  }

  findTotal(){
    this.service.total_all(null, null).subscribe(
        result => {
          this.totalizador = [
            { name: 'green', title: 'Total Pago', value: result.total_pago, icon: 'local_atm'},
            { name: 'red', title: 'Total em Atraso', value: result.total_em_atraso || 0, icon: 'warning' },
            { name: 'blue', title: 'Total Futuro / Gerado', value: result.total_gerado || 0, icon: 'schedule' }
          ];      
        },
        error => {
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
        }
    );
  }

  findAll(){
    this.loading = true;
    this.service.list_all(this.searchTerm, null, this.pageIndex + 1, this.pageSize).subscribe(
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

  find(event:any) {
    this.loading = true;
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
     this.findAll()
    }, 2000);
  }

  clearSearch() {
    this.pageIndex = 0;
    this.searchTerm = '';
    this.findAll();
  }

  generateExcel(): void {
    console.log("teste")
  }

  openTransacaoModal(element: any){
    this.router.navigate(["/contrato/form/" + element.contrato_id]);
  }

  
  handlePageEvent(event: any){
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex =event.pageIndex;
    this.findAll()
  }
}
