import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-member-profile-dialog',
  templateUrl: './member-profile-dialog.component.html',
  styleUrls: ['./member-profile-dialog.component.scss']
})
export class MemberProfileDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public member: any) {}

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}