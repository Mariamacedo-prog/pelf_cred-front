import { CommonModule } from '@angular/common';
import { Component, EventEmitter,  Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {  MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog',
  imports: [ CommonModule,
    MatIconModule,
    MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() text = '';
  @Input() title = 'Atenção';
  @Input() positiveButton = 'Sim';
  @Input() negativeButton = 'Cancelar';
  @Input() type: 'warming' | 'success' | 'error' = 'warming';

  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() positiveClick = new EventEmitter<void>();

  onClose() {
    this.close.emit();
    this.show = false;
  }

  
  ngOnInit(){
  
  }

  onPositiveClick(): void {
    this.positiveClick.emit();
  }

  onCancelClick(): void {
    this.close.emit();
    this.show = false;
  }
}
