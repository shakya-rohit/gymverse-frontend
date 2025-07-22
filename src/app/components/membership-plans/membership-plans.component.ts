import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-membership-plans',
  templateUrl: './membership-plans.component.html',
  styleUrls: ['./membership-plans.component.scss']
})
export class MembershipPlansComponent {
  planForm: FormGroup;
  displayedColumns: string[] = ['name', 'duration', 'price'];
  dataSource = [
    { name: 'Basic', duration: '1 Month', price: '₹500' },
    { name: 'Standard', duration: '3 Months', price: '₹1200' },
    { name: 'Premium', duration: '6 Months', price: '₹2000' },
  ];

  constructor(private fb: FormBuilder) {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  addPlan() {
    if (this.planForm.valid) {
      this.dataSource.push(this.planForm.value);
      // this.planForm.reset();
    }
  }
}
