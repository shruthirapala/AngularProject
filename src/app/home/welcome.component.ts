import { Component, OnInit } from '@angular/core';
import { Customer } from './welcome.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl?.value === confirmEmailControl?.value) {
    return null;
  }
  return { match: true };
}

@Component({
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();
  public pageTitle = 'Sign In Form';
  emailMessage!: string;

  private validationMessages: Record<string, string> = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address',
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      emailGroup: this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', Validators.required],
        },
        { validator: emailMatcher }
      ),

      phone: [''],
      notification: 'email',
      sendCatalog: true,
    });

    this.customerForm
      .get('notification')
      ?.valueChanges.subscribe((value) => this.setNotification(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl?.valueChanges.subscribe((value) =>
      this.setMessage(emailControl)
    );
  }

  save() {
    console.log(this.customerForm);
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors)
        .map((key) => this.validationMessages[key])
        .join(' ');
    }
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
