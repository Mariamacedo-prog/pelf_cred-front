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


  constructor( private router: Router, private toast: ToastService, private service: ContratoService, private authService: AuthService
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
    console.log("teste")
  }
}
