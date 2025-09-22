import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { ServicoService } from '../../../services/servico.service';


@Component({
  selector: 'app-servico-grid',
    imports: [CommonModule, 
    MatPaginatorModule,
    MatIconModule,
    FormsModule, 
    MatFormFieldModule, 
    MatTableModule, 
    MatInputModule,
    DialogComponent,
    RouterModule,
    MatButtonModule],
  templateUrl: './servico-grid.component.html',
  styleUrl: './servico-grid.component.scss'
})
export class ServicoGridComponent {
access = 'total';
  private typingTimer: any;
  loading = false;

  displayedColumns: string[] = ['nome', 'descricao', 'valor', 'categoria', 'ativo', 'actions'];
  data = [];
  searchTerm: string = '';
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


  constructor( private router: Router, private toast: ToastService, private service: ServicoService, private authService: AuthService
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
    this.router.navigate(["/servico/novo"]);
  }


  ngOnInit(): void {
    this.findAll();
  }
  
  find(event:any) {
    this.loading = true;
    clearTimeout(this.typingTimer);
    this.pageIndex = 0

    this.typingTimer = setTimeout(() => {
     this.findAll()
     this.loading =false
    }, 2000);
  }
  
  findAll(){
    this.loading = true;

    this.service.get_all(this.searchTerm, this.pageIndex + 1, this.pageSize).subscribe(
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
    this.router.navigate(["/servico/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/servico/form/" + element.id]);
  }

  deleteItem(){
    if(this.modal.id){
      this.service.delete(this.modal.id).subscribe(
        result => {
            this.toast.show('success', "Sucesso!", result.detail ?? 'Serviço deletado com sucesso!');
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

  handlePageEvent(event: any){
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex =event.pageIndex;
    this.findAll()
  }
  
  openModal(element: any){
    this.modal.status = true;
    this.modal.text = `Confirma a exclusão do serviço "${element.nome}"?`;
    this.modal.id = element.id;
  }

  generateExcel(): void {
    console.log("teste")
  }
}
