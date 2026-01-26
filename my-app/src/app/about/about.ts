import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  student_id = 'K234111401';
  student_name = 'Tran Thi Bich Nga';
  student_email = 'nga@gmail.com';
  my_img = 'assets/images/nga.jpg';
}
