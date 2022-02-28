import { Component, OnInit } from '@angular/core';
import { Customer } from './welcome.model';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');
  if (emailControl?.pristine === confirmEmailControl?.pristine) {
    return null;
  }
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
