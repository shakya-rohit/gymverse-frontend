import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { MemberProfileDialogComponent } from '../member-profile-dialog/member-profile-dialog.component';
import { MemberService } from 'src/app/services/member.service';
import { MembershipPlanService } from 'src/app/services/membership-plan.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { delay } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MemberDialogComponent } from '../member-dialog/member-dialog.component';


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

  plans: any[] = [];
  editingMemberId: string | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private memberService: MemberService, private membershipPlanService: MembershipPlanService, private snackBar: MatSnackBar) {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      membership: ['', Validators.required],
      status: ['', Validators.required],
      membershipPlanId: ['', Validators.required]
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

  ngOnInit(): void {
    this.loadMembers();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.membershipPlanService.getAllPlans().subscribe((data) => {
      this.plans = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // onSubmit() {
  //   if (this.memberForm.invalid) return;

  //   const newMember = this.memberForm.value;

  //   if (this.editingIndex === null) {
  //     // Add member
  //     this.dataSource.data = [...this.dataSource.data, newMember];
  //   } else {
  //     // Update existing member
  //     const updated = [...this.dataSource.data];
  //     updated[this.editingIndex] = newMember;
  //     this.dataSource.data = updated;
  //     this.editingIndex = null;
  //   }

  //   this.memberForm.reset();
  // }

  // onSubmit() {
  //   if (this.memberForm.invalid) return;

  //   const memberData = this.memberForm.value;

  //   if (this.editingIndex === null) {
  //     this.memberService.create(memberData).subscribe(newMember => {
  //       this.dataSource.data = [...this.dataSource.data, newMember];
  //       this.memberForm.reset();
  //     });
  //   } else {
  //     const memberId = this.dataSource.data[this.editingIndex].memberId;
  //     this.memberService.update(memberId, memberData).subscribe(updated => {
  //       const updatedData = [...this.dataSource.data];
  //       updatedData[this.editingIndex!] = updated;
  //       this.dataSource.data = updatedData;
  //       this.memberForm.reset();
  //       this.editingIndex = null;
  //     });
  //   }
  // }

  onSubmit() {
    if (this.memberForm.invalid) return;

    const formValue = this.memberForm.value;

    if (this.editingMemberId) {
      // Edit mode
      this.memberService.update(this.editingMemberId, formValue).subscribe({
        next: (updatedMember) => {
          // Refresh table or replace updated member in dataSource
          const index = this.dataSource.data.findIndex(m => m.memberId === this.editingMemberId);
          if (index !== -1) {
            this.dataSource.data[index] = updatedMember;
            this.dataSource._updateChangeSubscription(); // refresh table
          }
          this.cancelEdit();
          this.showSnackBar('Member updated successfully!');
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      // Add mode
      this.memberService.create(formValue).subscribe({
        next: (newMember) => {
          this.dataSource.data = [...this.dataSource.data, newMember];
          this.memberForm.reset();
          this.showSnackBar('Member added successfully!');

        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }



  // editMember(member: any) {
  //   this.editingIndex = this.dataSource.data.indexOf(member);
  //   this.memberForm.setValue({
  //     name: member.name,
  //     age: member.age,
  //     membership: member.membership,
  //     status: member.status,
  //   });
  // }

  // editMember(member: any) {
  //   this.editingMemberId = member.memberId; // capture actual ID
  //   this.editingIndex = this.dataSource.data.indexOf(member);
  //   this.memberForm.setValue({
  //     name: member.name,
  //     age: member.age,
  //     membership: member.membership,
  //     membershipPlanId: member.membershipPlanId,  // must be set
  //     status: member.status,
  //   });
  // }

  // deleteMember(member: any) {
  //   const updated = [...this.dataSource.data].filter(m => m !== member);
  //   this.dataSource.data = updated;
  //   this.cancelEdit();
  // }

  // deleteMember(member: any) {
  //   this.memberService.delete(member.memberId).subscribe(() => {
  //     this.dataSource.data = this.dataSource.data.filter(m => m.memberId !== member.memberId);
  //     this.cancelEdit();
  //   });
  // }

  // deleteMember(member: any) {
  //   this.memberService.delete(member.memberId).subscribe({
  //     next: () => {
  //       this.dataSource.data = this.dataSource.data.filter(m => m.memberId !== member.memberId);
  //       this.cancelEdit();
  //     },
  //     error: (err) => {
  //       console.error('Error deleting member:', err);
  //     }
  //   });
  // }

  deleteMember(member: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete member "${member.name}"?`
      },
      panelClass: 'confirm-dialog-top'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.memberService.delete(member.memberId).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(m => m.memberId !== member.memberId);
            this.cancelEdit();
            this.showSnackBar('Member deleted successfully!');
          },
          error: (err) => {
            console.error('Error deleting member:', err);
            this.showSnackBar('Failed to delete member.');
          }
        });
      }
    });
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

  // loadMembers() {
  //   this.isLoading = true;
  //   this.memberService.getAll().subscribe({
  //     next: (members) => {
  //       this.dataSource.data = members;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading members:', err);
  //       this.isLoading = false;
  //     }
  //   });
  // }

  loadMembers() {
    this.isLoading = true;
    this.memberService.getAll()
      .subscribe({
        next: (members) => {
          this.dataSource.data = members;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading members:', err);
          this.isLoading = false;
        }
      });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  exportToCSV(): void {
    const rows = this.dataSource.data.map(m => ({
      Name: m.name,
      Age: m.age,
      Membership: m.membership,
      Status: m.status,
      'Start Date': m.joiningDate,
      'End Date': m.expiryDate
    }));

    const headers: (keyof typeof rows[0])[] = [
      'Name',
      'Age',
      'Membership',
      'Status',
      'Start Date',
      'End Date'
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
    a.setAttribute('download', 'members.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  exportToPDF(): void {
    const doc = new jsPDF();
    const rows = this.dataSource.data.map(m => [
      m.name,
      m.age,
      m.membership,
      m.status,
      m.joiningDate,
      m.expiryDate
    ]);

    autoTable(doc, {
      head: [['Name', 'Age', 'Membership', 'Status', 'Start Date', 'End Date']],
      body: rows
    });

    doc.save('members.pdf');
  }

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '60%',
      data: null,
      autoFocus: false // prevents focus on close button
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }

  editMember(member: any) {
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '60%',
      data: member,
      autoFocus: false // prevents focus on close button
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }


}