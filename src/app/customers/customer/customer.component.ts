import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      console.log(c.value);
      return { range: true };
    }
    return null;
  };
}

function compareText (c: AbstractControl): { [k: string]: boolean } | null {
  let email = c.get('email');
  let confirmEmail = c.get('confirmEmail');

  if (email?.pristine || confirmEmail?.pristine) {
    return null;
  }

  if (email?.value === confirmEmail?.value) {
    return null;
  }
  return {'match':true};
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup|any;
  customer = new Customer();
  emailMessage: string | undefined;

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() { 
    this.customerForm = this.fb.group({
      firstName: ['',
        [Validators.required,Validators.minLength(3)]],
      lastName: '',
      email: '',
      emailGroup: this.fb.group({
        email: ['', Validators.required],
        confirmEmail: ['', Validators.required]
      }, {validator: compareText}),
      phone: '',
      notification: 'email',
      sendCatalog: true,
      rating: [null, ratingRange(1,5)]
    });
    // this.customerForm.valueChanges.subscribe((value: any) => 
    //   console.log(JSON.stringify(value)));

    // this.customerForm.get('notification').valueChanges.subscribe(((value: any) => 
    //   console.log(value)));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.subscribe(
      (value: any) => this.setMessage(emailControl)
    );
  }

  populateTestData() {
    this.customerForm.setValue({
      firstName: 'Jack',
      lastName: 'Hugo',
      email: 'jh@TestBed.de',
      sendCatalog: false
    })
  }

  setNotification(type: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (type === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    /* if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]
      );
    } */
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}