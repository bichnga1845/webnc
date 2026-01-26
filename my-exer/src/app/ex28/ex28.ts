import { Component } from '@angular/core';
import { Bitcoinservices } from '../myservices/bitcoinservices';
import { ICryptocurrency } from '../myclass/ibitcoin';

@Component({
  selector: 'app-ex28',
  standalone: false,
  templateUrl: './ex28.html',
  styleUrl: './ex28.css',
})
export class Ex28 {
  cryptoData: ICryptocurrency[] = [];
  errorMessage: string = '';

  constructor(private _cryptoService: Bitcoinservices) {
    this._cryptoService.getCryptoPrice().subscribe({
      next: (data) => {
        this.cryptoData = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  getChangeClass(change: string): string {
    const value = parseFloat(change);
    return value >= 0 ? 'text-success' : 'text-danger';
  }

  getChangeIcon(change: string): string {
    const value = parseFloat(change);
    return value >= 0 ? '▲' : '▼';
  }
}
