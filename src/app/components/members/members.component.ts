import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { MemberProfileDialogComponent } from '../member-profile-dialog/member-profile-dialog.component';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements AfterViewInit {
  displayedColumns = ['name', 'age', 'membership', 'status', 'startDate', 'endDate', 'actions'];

  dataSource = new MatTableDataSource<any>([]);
  memberForm: FormGroup;
  editingIndex: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      membership: ['', Validators.required],
      status: ['', Validators.required],
    });

    // Initial dummy data
    this.dataSource.data = [
      {
        name: 'John Doe', age: 28, membership: 'Gold', status: 'Active', photo: 'https://i.pravatar.cc/100?img=3', startDate: '2024-08-01',
        endDate: '2024-08-31'
      },
      {
        name: 'Jane Smith', age: 32, membership: 'Silver', status: 'Expired', startDate: '2024-04-01',
        endDate: '2024-06-30'
      },
      {
        name: 'Bob Johnson', age: 45, membership: 'Platinum', status: 'Active', startDate: '2024-04-01',
        endDate: '2025-07-27'
      }
    ];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onSubmit() {
    if (this.memberForm.invalid) return;

    const newMember = this.memberForm.value;

    if (this.editingIndex === null) {
      // Add member
      this.dataSource.data = [...this.dataSource.data, newMember];
    } else {
      // Update existing member
      const updated = [...this.dataSource.data];
      updated[this.editingIndex] = newMember;
      this.dataSource.data = updated;
      this.editingIndex = null;
    }

    this.memberForm.reset();
  }

  editMember(member: any) {
    this.editingIndex = this.dataSource.data.indexOf(member);
    this.memberForm.setValue({
      name: member.name,
      age: member.age,
      membership: member.membership,
      status: member.status,
    });
  }

  deleteMember(member: any) {
    const updated = [...this.dataSource.data].filter(m => m !== member);
    this.dataSource.data = updated;
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingIndex = null;
    this.memberForm.reset();
  }

  viewMember(member: any) {
    this.dialog.open(MemberProfileDialogComponent, {
      data: member,
      width: '400px'
    });
  }

  isExpiringSoon(endDateStr: string): boolean {
    const endDate = new Date(endDateStr);
    const today = new Date();
    const diff = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff <= 7 && diff >= 0;
  }


}