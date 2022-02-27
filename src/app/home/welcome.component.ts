import { Component, OnInit } from '@angular/core';
import { Customer } from './welcome.model';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();
  public pageTitle = 'Sign In Form';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', Validators.required],
      phone: [''],
      notification: 'email',
      sendCatalog: true,
    });
  }

  save() {
    console.log(this.customerForm);
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl?.setValidators(Validators.required);
    } else {
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
  }
}
