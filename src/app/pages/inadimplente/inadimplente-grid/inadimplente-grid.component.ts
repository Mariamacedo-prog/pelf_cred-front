import { Component } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast';
import { AuthService } from '../../../services/auth';
import { ExportService } from '../../../services/export.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { TransacaoService } from '../../../services/transacao.service';

@Component({
  selector: 'app-inadimplente-grid',
  imports: [CommonModule, 
    MatPaginatorModule,
    MatIconModule,
    MatTableModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    RouterModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule],
  templateUrl: './inadimplente-grid.component.html',
  styleUrl: './inadimplente-grid.component.scss'
})
export class InadimplenteGridComponent {
  access = 'total';
  private typingTimer: any;
  loading = false;

  displayedColumns: string[] = ['contrato', 'documento', 'email', 'telefone', 'data_vencimento', 'numero_parcela', 'valor', 'actions'];
  data = [];
  searchTerm: string = '';
  searchDate: any = null;
  searchDays = null;
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


  constructor( 
    private router: Router, 
    private toast: ToastService, 
    private transacaoService: TransacaoService, 
    private authService: AuthService, 
    private exportService: ExportService
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
  }
  
  find(event:any) {
    const input = (event.target as HTMLInputElement).value;
    this.loading = true;
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
     this.findAll()
     this.loading =false
    }, 2000);
  }
  
  findAll(){
    this.loading = true;

    this.transacaoService.list_all_overdue(this.searchDays ?? '', this.pageIndex + 1, this.pageSize).subscribe(
        result => {
            this.data = result?.data ?? []
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

  editItem(element: any){
    this.router.navigate(["/inadimplente/form/" + element.id ]);
  }

  clearSearch() {
    this.pageIndex = 0;
    this.searchDays = null;
    this.findAll();
  }

  handlePageEvent(event: any){
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex =event.pageIndex;
    this.findAll()
  } 
}
