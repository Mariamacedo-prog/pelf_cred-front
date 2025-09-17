import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth';
import { UserService } from '../../../services/user.service';

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


  constructor(private router: Router, private toast: ToastService, private userService: UserService, 
    public dialog: MatDialog, private authService: AuthService
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
    this.userService.list_all_users(this.searchTerm, this.pageIndex + 1, this.pageSize).subscribe(
        result => {
            this.data = result?.data ?? []
            this.length = result?.total_items ?? 0
        },
        error => {
          console.error(error.error.detail);
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
        }
    );
  }

  viewItem(element: any){
    this.router.navigate(["/usuario/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/usuario/form/" + element.id]);
  }

  deleteItem(){
    if(this.modal.id){
      this.userService.delete_user(this.modal.id).subscribe(
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



  handlePageEvent(event: any){
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex =event.pageIndex;
    this.findAll()
  }
  
  openModal(element: any){
    this.modal.status = true;
    this.modal.text = `Confirma a exclusão do usuário "${element.nome}"?`;
    this.modal.id = element.id;
  }

  generateExcel(): void {
    console.log("teste")
  }
}
