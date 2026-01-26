import { Component } from '@angular/core';
import { Bitcoinservices } from '../myservices/bitcoinservices';
import { IBitcoinPrice, ITime, IBPI } from '../myclass/ibitcoin';

@Component({
  selector: 'app-ex28',
  standalone: false,
  templateUrl: './ex28.html',
  styleUrl: './ex28.css',
})
export class Ex28 {
  bitcoinData!: IBitcoinPrice;
  time!: ITime;
  bpi!: IBPI;
  errorMessage: string = '';

  constructor(private _bitcoinService: Bitcoinservices) {
    this._bitcoinService.getBitcoinPrice().subscribe({
      next: (data) => {
        this.bitcoinData = data;
        this.time = data.time;
        this.bpi = data.bpi;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
