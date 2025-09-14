import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog',
  imports: [ CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  text = '';
  title = 'ATENÇÃO';
  positiveButton = 'Sim';
  negativeButton = 'Cancelar';


  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(){
     this.text = this.data.text;
     if(this.data.positiveButton){
      this.positiveButton = this.data.positiveButton;
     }

     if(this.data.title){
      this.title = this.data.title;
     }

     if(this.data.negativeButton){
      this.negativeButton = this.data.negativeButton;
     }
    }

    onYesClick(): void {
      this.dialogRef.close(true);
    }

    onCancelClick(): void {
      this.dialogRef.close(false);
    }
}
