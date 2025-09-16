import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../services/toast';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-user-grid',
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
  templateUrl: './user-grid.component.html',
  styleUrl: './user-grid.component.scss'
})
export class UserGridComponent {
  access = 'total';
  private typingTimer: any;
  loading = false;

  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'email', 'actions'];
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
  
  addNewUser() {
    this.router.navigate(["/usuario/novo"]);
  }


  ngOnInit(): void {
    this.findAllUsers();
    
  }
  
  findUser(event:any) {
    const input = (event.target as HTMLInputElement).value;
    this.loading = true;
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
     this.findAllUsers()
     this.loading =false
    }, 2000);
  }

  handlePageEvent(event: any){
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex =event.pageIndex;
    this.findAllUsers()
  }
  
  viewItem(element: any){
    this.router.navigate(["/usuario/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/usuario/form/" + element.id]);
  }

  findAllUsers(){
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

  openModal(element: any){
    this.modal.status = true;
    this.modal.text = `Confirma a exclusão do usuário "${element.nome}"?`;
    this.modal.id = element.id;
  }

  deleteItem(){
    if(this.modal.id){
      this.userService.delete_user(this.modal.id).subscribe(
        result => {
            this.toast.show('success', "Sucesso!", 'UsuÃ¡rio deletado com sucesso!');
            this.findAllUsers();
            this.closeModal()
        },
        error => {
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro, tente novamente')
        }
      );
    }
    
  }

  generateExcel(): void {
    console.log("teste")
  }
}
