import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { VendedorService } from '../../../services/vendedor.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-vendedor-grid',
  imports: [
    CommonModule, 
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
  templateUrl: './vendedor-grid.component.html',
  styleUrl: './vendedor-grid.component.scss'
})
export class VendedorGridComponent {
access = 'total';
  private typingTimer: any;
  loading = false;

  displayedColumns: string[] = ['foto', 'nome', 'cpf', 'cidade', 'actions'];
  data = [];
  searchTerm: string = '';
  searchCity = new FormControl('');
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


  constructor( private router: Router, private toast: ToastService, private service: VendedorService, private authService: AuthService
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
    this.router.navigate(["/vendedor/novo"]);
  }


  ngOnInit(): void {
    this.findAll();
    this.getCity();

    this.filteredOptions = this.searchCity.valueChanges.pipe(
      startWith(''),
      map(value => {
        this.loading = true;
        clearTimeout(this.typingTimer);

        this.typingTimer = setTimeout(() => {
          this.findAll()
          this.loading =false
        }, 2000);

        const input = typeof value === 'string' ? value : '';
        return this.filterCity(input);
    })
);
  }

  filterCity(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsCity.filter((option: any) =>
      option.cidade.toLowerCase().includes(filterValue)
  );
  }

  getCity(search: string = '') {
    this.service.get_city(search).subscribe(
        result => {
          console.log(result)
            this.optionsCity = result ?? []
        },
        error => {
            this.toast.show('error', "Erro!", error.error.detail || 
              'Ocorreu um erro ao localizar cidades.')
        }
    );
  }
  
  find(event:any) {
    this.loading = true;
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
     this.findAll()
     this.loading =false
    }, 2000);
  }
  
  findAll(){
    this.loading = true;
    this.service.list_all(this.searchTerm, this.pageIndex + 1, this.searchCity.getRawValue(), this.pageSize).subscribe(
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
    this.router.navigate(["/vendedor/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id]);
  }

  deleteItem(){
    if(this.modal.id){
      this.service.delete(this.modal.id).subscribe(
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
    this.searchTerm = '';
    this.searchCity.setValue(null);
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
