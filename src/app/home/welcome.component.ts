import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Customer } from './welcome.model';

@Component({
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  customer = new Customer();
  public pageTitle = 'Welcome';

  constructor() {}

  save(customerForm: NgForm) {
    console.log(customerForm.form);
  }
}
