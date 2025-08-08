import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrainerService } from 'src/app/services/trainer.service';
import { Trainer } from 'src/app/models/trainer.model';

@Component({
  selector: 'app-trainer-dialog',
  templateUrl: './trainer-dialog.component.html'
})
export class TrainerDialogComponent implements OnInit {
  trainerForm!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private trainerService: TrainerService,
    private dialogRef: MatDialogRef<TrainerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Trainer | null
  ) {}

  ngOnInit() {
    this.trainerForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      specialty: [this.data?.specialty || '', Validators.required],
      phone: [this.data?.phone || '', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: [this.data?.email || '', [Validators.required, Validators.email]]
    });
  }

  onSave() {
    if (this.trainerForm.invalid) return;
    this.isSaving = true;

    const payload = this.trainerForm.value;

    const save$ = this.data
      ? this.trainerService.update(this.data.trainerId!, payload)
      : this.trainerService.create(payload);

    save$.subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error saving trainer', err);
        this.isSaving = false;
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}