
import {Component, EventEmitter, Output, ChangeDetectorRef, inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth';
import { MenuService } from '../../services/menu.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthState } from '../../services/storage.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
  isLoggedIn:boolean = false;
  private _mobileQueryListener: () => void;
  private store = inject(Store);

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private menuService: MenuService, 
    private media: MediaMatcher,
    private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 1200px)');
    this._mobileQueryListener = () => {
      this.isMenuOpen = !this.mobileQuery.matches;
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
     this.store.select(state => state.auth?.isLoggedIn).subscribe(
        logged => {
          this.isLoggedIn = logged;
        }
    );
  }

  ngOnInit(): void {
    this.generateListMenu()
  }

  generateListMenu(){
    let teste = this.menuService.getMenuItems();
    let novoMenuList: MenuItem[] = [];

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
    if(this.isLoggedIn){
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
