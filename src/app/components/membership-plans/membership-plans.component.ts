import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MembershipPlanService } from 'src/app/services/membership-plan.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-membership-plans',
  templateUrl: './membership-plans.component.html',
  styleUrls: ['./membership-plans.component.scss']
})
export class MembershipPlansComponent implements AfterViewInit {
  displayedColumns = ['name', 'durationInMonths', 'price', 'features', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  planForm: FormGroup;
  editingPlanId: string | null = null;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private planService: MembershipPlanService,
    private snackBar: MatSnackBar
  ) {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      durationInMonths: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      features: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPlans();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPlans() {
    this.isLoading = true;
    this.planService.getAllPlans().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.planForm.invalid) return;
    const formValue = this.planForm.value;

    if (this.editingPlanId) {
      this.planService.update(this.editingPlanId, formValue).subscribe({
        next: (updated) => {
          const idx = this.dataSource.data.findIndex(p => p.planId === this.editingPlanId);
          if (idx !== -1) {
            this.dataSource.data[idx] = updated;
            this.dataSource._updateChangeSubscription();
          }
          this.cancelEdit();
          this.showSnackBar('Plan updated successfully!');
        },
        error: () => this.showSnackBar('Update failed')
      });
    } else {
      this.planService.create(formValue).subscribe({
        next: (newPlan) => {
          this.dataSource.data = [...this.dataSource.data, newPlan];
          this.planForm.reset();
          this.showSnackBar('Plan added successfully!');
        },
        error: () => this.showSnackBar('Creation failed')
      });
    }
  }

  editPlan(plan: any) {
    this.editingPlanId = plan.planId;
    this.planForm.setValue({
      name: plan.name,
      durationInMonths: plan.durationInMonths,
      price: plan.price,
      features: plan.features,
    });
  }

  deletePlan(plan: any) {
    if (!confirm(`Are you sure you want to delete "${plan.name}"?`)) return;

    this.planService.delete(plan.planId).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(p => p.planId !== plan.planId);
        this.showSnackBar('Plan deleted');
        this.cancelEdit();
      },
      error: () => this.showSnackBar('Delete failed')
    });
  }

  cancelEdit() {
    this.editingPlanId = null;
    this.planForm.reset();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportToCSV(): void {
    const rows = this.dataSource.data.map(p => ({
      Name: p.name,
      Duration: p.durationInMonths,
      Price: p.price,
      Features: p.features
    }));

    const headers: (keyof typeof rows[0])[] = [
      'Name',
      'Duration',
      'Price',
      'Features'
    ];

    const csvRows = [
      headers.join(','), // header row
      ...rows.map(row =>
        headers.map(field => `"${row[field] ?? ''}"`).join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'membership_plans.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  exportToPDF() {
    const doc = new jsPDF();
    const rows = this.dataSource.data.map(p => [
      p.name, p.durationInMonths, p.price, p.features
    ]);

    autoTable(doc, {
      head: [['Name', 'Duration', 'Price', 'Features']],
      body: rows
    });

    doc.save('membership_plans.pdf');
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
}