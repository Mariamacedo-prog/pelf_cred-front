import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { Store, StoreModule } from '@ngrx/store';
import { authReducer, AuthState } from './services/storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuComponent, 
    CommonModule,
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pelf-cred';
  isMenuOpen: boolean = false;
  isLoggedIn: boolean = false;
  private store = inject(Store);

  constructor(private authService: AuthService,) {
    this.store.select(state => state.auth?.isLoggedIn).subscribe(
      logged => {
        this.isLoggedIn = logged;
      }
    );
  }

  ngOnInit() {
  }

  onMenuToggled(isMenuOpen: any) {
    this.isMenuOpen = isMenuOpen;
  }
}
