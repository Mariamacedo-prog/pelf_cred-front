import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateCNPJ(control: FormControl): { [key: string]: any } | null{
    const cnpj = control.value?.replace(/[^\d]/g, '');

    if (!cnpj || cnpj.length !== 14) {
      return { 'cnpjInvalido': true };
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
      return { 'cnpjInvalido': true };
    }

    let sum = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }

    const digitoVerificador1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (parseInt(cnpj.charAt(12)) !== digitoVerificador1) {
      return { 'cnpjInvalido': true };
    }

    sum = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }

    const digitoVerificador2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (parseInt(cnpj.charAt(13)) !== digitoVerificador2) {
      return { 'cnpjInvalido': true };
    }

    return null;
  };

  validateCPF(control: FormControl): { [key: string]: any } | null {
    const cpf = control.value?.replace(/[^\d]/g, '');

    if (!cpf || cpf.length !== 11) {
      return { 'cpfInvalido': true };
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return { 'cpfInvalido': true };
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit = remainder >= 10 ? 0 : remainder;

    if (parseInt(cpf.charAt(9)) !== digit) {
      return { 'cpfInvalido': true };
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    digit = remainder >= 10 ? 0 : remainder;

    if (parseInt(cpf.charAt(10)) !== digit) {
      return { 'cpfInvalido': true };
    }

    return null;
  }

  validateRG(control: FormControl): { [key: string]: any } | null {
    const rg = control.value?.replace(/[^\dX]/g, '');

    if (!rg || rg.length !== 9) {
      return { 'rgInvalid': true };
    }

    return null;
  }

  validateCNS(control: FormControl): { [key: string]: any } | null {
    const cns = control.value?.replace(/[^\dX]/g, '');

    if (!cns || cns.length !== 6) {
      return { 'cnsInvalid': true };
    }

    return null;
  }
}