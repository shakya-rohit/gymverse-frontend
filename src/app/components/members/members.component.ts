import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'age', 'membership', 'status', 'actions'];
  dataSource = new MatTableDataSource([
    { name: 'John Doe', age: 28, membership: 'Gold', status: 'Active' },
    { name: 'Jane Smith', age: 32, membership: 'Silver', status: 'Expired' },
    { name: 'Bob Johnson', age: 45, membership: 'Platinum', status: 'Active' }
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editMember(member: any) {
    console.log('Edit clicked:', member);
    alert(`Edit clicked for ${member.name}`);
  }

  deleteMember(member: any) {
    const index = this.dataSource.data.indexOf(member);
    if (index >= 0) {
      const updatedData = [...this.dataSource.data];
      updatedData.splice(index, 1);
      this.dataSource.data = updatedData;
    }
  }
}