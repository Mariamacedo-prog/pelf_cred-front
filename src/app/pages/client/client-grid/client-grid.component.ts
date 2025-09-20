import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../services/toast';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AuthService } from '../../../services/auth';
import { ClientService } from '../../../services/client.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-client-grid',
  imports: [CommonModule, 
    MatPaginatorModule,
    MatIconModule,
    FormsModule, 
    MatFormFieldModule, 
    MatTableModule, 
    MatInputModule,
    DialogComponent,
    RouterModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule],
  templateUrl: './client-grid.component.html',
  styleUrl: './client-grid.component.scss'
})
export class ClientGridComponent {
  access = 'total';
  private typingTimer: any;
  loading = false;

  displayedColumns: string[] = ['nome', 'documento', 'endereco', 'telefone', 'email', 'status', 'actions'];
  data = [];
  searchTerm: string = '';
  searchDate: any = null;
  searchStatus = null;
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


  constructor( private router: Router, private toast: ToastService, private clientService: ClientService, private authService: AuthService
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
    this.router.navigate(["/cliente/novo"]);
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

    let formatedDate = null
    if(this.searchDate){
      const originalDate = new Date(this.searchDate);
      formatedDate = originalDate.toISOString().slice(0, 10);
    }


    this.clientService.list_all_clients(this.searchTerm, this.pageIndex + 1, formatedDate, this.searchStatus, this.pageSize).subscribe(
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

  viewItem(element: any){
    this.router.navigate(["/cliente/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/cliente/form/" + element.id]);
  }

  deleteItem(){
    if(this.modal.id){
      this.clientService.delete_client(this.modal.id).subscribe(
        result => {
            this.toast.show('success', "Sucesso!", result.detail ?? 'Usuário deletado com sucesso!');
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
    this.searchDate = null;
    this.searchTerm = '';
    this.searchStatus = null;
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
    this.modal.text = `Confirma a exclusão do cliente "${element.nome}"?`;
    this.modal.id = element.id;
  }

  generateExcel(): void {
    console.log("teste")
  }
}
