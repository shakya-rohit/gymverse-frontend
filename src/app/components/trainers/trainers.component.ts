import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { TrainerService } from 'src/app/services/trainer.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { Trainer } from 'src/app/models/trainer.model';
import { TrainerProfileDialogComponent } from '../trainer-profile-dialog/trainer-profile-dialog.component';
import { TrainerDialogComponent } from '../trainer-dialog/trainer-dialog.component';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss']
})
export class TrainersComponent implements AfterViewInit {
  displayedColumns = ['name', 'specialty', 'phone', 'email', 'actions'];
  dataSource = new MatTableDataSource<Trainer>([]);
  trainerForm: FormGroup;
  editingTrainerId: string | null = null;
  editingIndex: number | null = null;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private trainerService: TrainerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.trainerForm = this.fb.group({
      name: ['', Validators.required],
      specialty: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  viewTrainer(trainer: any) {
    this.dialog.open(TrainerProfileDialogComponent, {
      data: trainer,
      width: '400px'
    });
  }

  ngOnInit(): void {
    this.loadTrainers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTrainers(): void {
    this.isLoading = true;
    this.trainerService.getAll().subscribe({
      next: (trainers) => {
        this.dataSource.data = trainers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trainers:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onSubmit(): void {
    if (this.trainerForm.invalid) return;

    const formValue = this.trainerForm.value;

    if (this.editingTrainerId) {
      // Edit
      this.trainerService.update(this.editingTrainerId, formValue).subscribe({
        next: (updatedTrainer) => {
          const index = this.dataSource.data.findIndex(t => t.trainerId === this.editingTrainerId);
          if (index !== -1) {
            this.dataSource.data[index] = updatedTrainer;
            this.dataSource._updateChangeSubscription();
          }
          this.cancelEdit();
          this.showSnackBar('Trainer updated successfully!');
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      // Create
      this.trainerService.create(formValue).subscribe({
        next: (newTrainer) => {
          this.dataSource.data = [...this.dataSource.data, newTrainer];
          this.trainerForm.reset();
          this.showSnackBar('Trainer added successfully!');
        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }

  // editTrainer(trainer: Trainer): void {
  //   this.editingTrainerId = trainer.trainerId || null;
  //   this.editingIndex = this.dataSource.data.indexOf(trainer);
  //   this.trainerForm.setValue({
  //     name: trainer.name,
  //     specialty: trainer.specialty,
  //     phone: trainer.phone,
  //     email: trainer.email
  //   });
  // }

  deleteTrainer(trainer: Trainer): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete trainer "${trainer.name}"?`
      },
      panelClass: 'confirm-dialog-top'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.trainerService.delete(trainer.trainerId!).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(t => t.trainerId !== trainer.trainerId);
            this.cancelEdit();
            this.showSnackBar('Trainer deleted successfully!');
          },
          error: (err) => {
            console.error('Error deleting trainer:', err);
            this.showSnackBar('Failed to delete trainer.');
          }
        });
      }
    });
  }

  cancelEdit(): void {
    this.editingTrainerId = null;
    this.editingIndex = null;
    this.trainerForm.reset();
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  exportToCSV(): void {
    const rows = this.dataSource.data.map(t => ({
      Name: t.name,
      Specialty: t.specialty,
      Phone: t.phone,
      Email: t.email
    }));

    const headers = ['Name', 'Specialty', 'Phone', 'Email'];
    const csvRows = [
      headers.join(','),
      ...rows.map(row => headers.map(h => `"${row[h as keyof typeof row] ?? ''}"`).join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.href = url;
    a.download = 'trainers.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const rows = this.dataSource.data.map(t => [
      t.name,
      t.specialty,
      t.phone,
      t.email
    ]);

    autoTable(doc, {
      head: [['Name', 'Specialty', 'Phone', 'Email']],
      body: rows
    });

    doc.save('trainers.pdf');
  }

  openAddTrainerDialog() {
    const dialogRef = this.dialog.open(TrainerDialogComponent, {
      width: '60%',
      data: null,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTrainers();
      }
    });
  }

  editTrainer(trainer: Trainer) {
    const dialogRef = this.dialog.open(TrainerDialogComponent, {
      width: '60%',
      data: trainer,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTrainers();
      }
    });
  }

}