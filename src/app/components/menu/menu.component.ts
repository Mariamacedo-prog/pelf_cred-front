
import {Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth';
import { MenuService } from '../../services/menu.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  value?: string;
}



@Component({
  selector: 'app-menu',
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Output() menuToggled = new EventEmitter<boolean>();
  menuItens: MenuItem[] = [];
  isMenuOpen = false;
  permissions: any;
  mobileQuery: MediaQueryList;
  isLoggedIn: boolean = false;
  private _mobileQueryListener: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private menuService: MenuService, 
    private media: MediaMatcher, 
    private authService: AuthService,
    private storageService: StorageService) {
    this.mobileQuery = media.matchMedia('(max-width: 1200px)');
    this._mobileQueryListener = () => {
      this.isMenuOpen = !this.mobileQuery.matches;
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.get('isLoggedIn') || false;
    this.generateListMenu()
  }

  generateListMenu(){
    let teste = this.menuService.getMenuItems();
    let novoMenuList: MenuItem[] = [];

    console.log(teste, "teste")

    for(let item of teste){
     // if(this.permissions && this.permissions[item.value] != null){
     if(true){
        //  if(this.permissions[item.value] != 'restrito'){
            novoMenuList.push(item);
         // }
      } 
      
    }
    
    this.menuItens = novoMenuList
  }

  isAuthenticated(): boolean | null{
    if(localStorage.getItem('isLoggedIn') == 'true'){
      return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  logout(){
    this.authService.logout()
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggled.emit(this.isMenuOpen);
  }
}
