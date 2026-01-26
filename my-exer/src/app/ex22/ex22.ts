import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICourseRegistration } from '../myclass/icourse-registration';

@Component({
  selector: 'app-ex22',
  standalone: false,
  templateUrl: './ex22.html',
  styleUrl: './ex22.css',
})
export class Ex22 implements OnInit {
  registrationForm!: FormGroup;
  jsonOutput: string = '';
  submitted: boolean = false;

  courses: string[] = [
    'Angular Development',
    'React Development',
    'Node.js Backend',
    'Python Programming',
    'Java Spring Boot',
    'Database Design'
  ];

  semesters: string[] = ['Spring 2024', 'Summer 2024', 'Fall 2024', 'Winter 2025'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      course: ['', Validators.required],
      semester: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.registrationForm.valid) {
      const formData: ICourseRegistration = this.registrationForm.value;
      this.jsonOutput = JSON.stringify(formData, null, 2);
    } else {
      this.jsonOutput = '';
    }
  }

  onReset() {
    this.registrationForm.reset();
    this.jsonOutput = '';
    this.submitted = false;
  }

  // Helper method to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }
}
