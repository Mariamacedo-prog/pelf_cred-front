import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageService } from './services/storage.service';
import { MenuComponent } from './components/menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pelf-cred';
  isMenuOpen: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.isLoggedIn = this.storageService.get('isLoggedIn') || false;
  }

  onMenuToggled(isMenuOpen: any) {
    this.isMenuOpen = isMenuOpen;
  }
}
