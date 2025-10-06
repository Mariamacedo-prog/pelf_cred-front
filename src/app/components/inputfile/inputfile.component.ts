
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-inputfile',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './inputfile.component.html',
  styleUrl: './inputfile.component.scss'
})

export class InputfileComponent {
  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>();
  @Input() nome: string = '';
  nomeBotao: string = 'Selecionar Arquivo';
  showModal: boolean = false;
  maxNomeBotaoLength: number = 25;
  pdfSrc: SafeResourceUrl | null = null;
  pdfBlob: any;
  imagemSrc: string | undefined;
  @Input() accept: string = '.pdf,.jpg';
  @Input() fileInput: any;
  @Input() view: boolean = false ;
  @Output() fileOutput: EventEmitter<{ base64: string, type: string, name: string }> = new EventEmitter<{ base64: string, type: string, name: string }>();

  constructor(public sanitizer:DomSanitizer) {

  }

  ngOnInit(){
    this.imagemSrc = undefined;
    this.pdfSrc = null;

    if(this.fileInput  && this.fileInput.tipo && this.fileInput.base64){
      if(this.fileInput.tipo == 'application/pdf' && this.fileInput.base64 ){
        const base64String = this.fileInput.base64.split(',')[1];
        this.convertBase64ToPDF(base64String);
        this.imagemSrc = undefined;
      }else if((this.fileInput.tipo == 'image/jpeg' || this.fileInput.tipo == 'image/jpg' || this.fileInput.tipo == 'image/png') && this.fileInput.base64){
        this.imagemSrc = this.fileInput.base64;
        this.pdfSrc = null;
      }else{
        this.imagemSrc = undefined;
        this.pdfSrc = null;
      }
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.convertToBase64(selectedFile);
    }
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        const base64String = (reader.result as string).split(',')[1];
        if (file.type.startsWith('image/')) {
          this.imagemSrc = 'data:image/jpeg;base64,' + base64String;
          this.fileOutput.emit({base64: this.imagemSrc, type: file.type, name: file.name});
          this.pdfSrc = null;
        } else if (file.type === 'application/pdf') {
          this.convertBase64ToPDF(base64String)
          this.fileOutput.emit({base64: "data:application/pdf;base64," + base64String, type: file.type, name: file.name});
          this.imagemSrc = undefined;
        }
      } else {
        console.error('Error: reader.result is null.');
      }
    };

    reader.onerror = error => {
      console.error('Error converting to Base64:', error);
    };
  }

  convertBase64ToPDF(base64String: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  }

  closeModal(){
    this.showModal = false;
  }
  openModal(){
    this.showModal = true;
  }
}

