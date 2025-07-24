import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-trainer-profile-dialog',
  templateUrl: './trainer-profile-dialog.component.html',
  styleUrls: ['./trainer-profile-dialog.component.scss']
})
export class TrainerProfileDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public trainer: any) {}

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}