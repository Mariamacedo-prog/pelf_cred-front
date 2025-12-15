import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, EventEmitter,  Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TransacaoService } from '../../services/transacao.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { ToastService } from '../../services/toast';
import { InputfileComponent } from '../inputfile/inputfile.component';

@Component({
  selector: 'app-dialog-transacao',
  imports: [ CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    InputfileComponent,
    MatDialogModule],
  templateUrl: './dialog-transacao.component.html',
  styleUrl: './dialog-transacao.component.scss'
})
export class DialogTransacaoComponent {
  @Input() data: any = {};
  @Input() show = false;
  @Input() editModal = false;
  @Output() positiveClick = new EventEmitter<void>();
  @ViewChild('fileInputTransacao')  fileInput!: ElementRef<HTMLInputElement>;
  formControls!: FormGroup;
  anexoControls!: FormGroup;
  hoje = new Date();
  anexo: any = {};
  valorFormatado: any = ''

  constructor(
    private location: Location,
    private transacaoService: TransacaoService,
    private toast: ToastService,
  ) {}

  onClose() {
    this.location.back();
    this.show = false;
  }

  ngOnInit(){
    this.formControls = new FormGroup({
      comprovante_numero: new FormControl(this.data.comprovante_numero || "123"),
      data_pagamento: new FormControl(this.data.data_pagamento || this.hoje || null),
      meio_pagamento:  new FormControl(this.data.meio_pagamento || null),
      valor_pago:  new FormControl(this.data.valor_pago || null)
    });
    this.anexoControls = new FormGroup({
      id: new FormControl(null),
      image: new FormControl(null),
      base64: new FormControl(''),
      descricao: new FormControl(''),
      nome: new FormControl(''),
      tipo: new FormControl('')
    });

    if(this.data.valor_pago){
      const valor = this.data.valor_pago;
      const resultado = valor.toFixed(2);
      this.formatarValor(`${resultado}`)
    }
  }

  onPositiveClick(): void {
    let body = this.formControls.getRawValue();
    body.anexo = this.anexoControls.getRawValue();
    this.transacaoService.edit(this.data.id, body).subscribe(
      data => {
          this.toast.show('success', "Sucesso!", data.detail ?? 'Transação atualizado com sucesso!');
          this.location.back();
      },
      error => {
        console.log(error, "error")
      }
    )
  }

  onCancelClick(): void {
    this.location.back();
    this.show = false;
  }

  onSelectPicture(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file: File = input.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf' ];

    if (!validTypes.includes(file.type)) {
      alert('Por favor, selecione uma imagem JPG, PNG ou PDF');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      this.anexoControls?.patchValue({
        image: '',
        base64: base64 || '',
        descricao: '',
        nome: file.name || '',
        tipo: file.type || '',
      });
    };

    reader.readAsDataURL(file);
  }

  openFileSelector(){
    this.fileInput.nativeElement.click();
  }

  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (this.anexo) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
      this.anexoControls?.patchValue({
        image: '',
        base64: event.base64 || '',
        descricao: '',
        nome: event.name || '',
        tipo: event.type || '',
      });
    }
  }
  saveFileBase64(event: any){
    this.anexo.base64 = event.base64;
    this.anexo.nome = event.name;
    this.anexo.tipo = event.type;
    this.anexoControls?.patchValue({
      image: '',
      base64: event.base64 || '',
      descricao: '',
      nome: event.name || '',
      tipo: event.type || '',
    });
  }

  blockNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  onChangeValor(event: any){
    const input = event.target as HTMLInputElement;
    const value = input?.value;
    this.formatarValor(value)
  }

  formatarValor(value: string): void {
    let digits = value.replace(/\D/g, '');
    digits = digits.replace(/^0+/, '') || '0';

    while (digits.length < 3) {
      digits = '0' + digits;
    }

    const reais = digits.slice(0, -2);
    const centavos = digits.slice(-2);
    this.valorFormatado = `R$ ${parseInt(reais, 10)},${centavos}`;

    const valorDecimal = parseFloat(`${reais}.${centavos}`);

    this.formControls.get('valor_pago')?.setValue(valorDecimal);
  }
}
