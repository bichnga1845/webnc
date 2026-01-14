import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  sendContact():void
  {
    const input_name=document.getElementById("name") as HTMLInputElement
    const input_email=document.getElementById("email") as HTMLInputElement
    const td_phanhoi=document.getElementById("tdphanhoi")
    alert("Tôi đã nhận được phản hồi "+input_name.value)
  }
}
