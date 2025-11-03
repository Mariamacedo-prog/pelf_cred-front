import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-box-totalizado',
  imports: [
    MatIconModule,
    CommonModule, 
  ],
  templateUrl: './box-totalizado.component.html',
  styleUrl: './box-totalizado.component.scss'
})
export class BoxTotalizadoComponent {
  @Input() data: any = [];

}
