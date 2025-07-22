import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembersComponent } from '../members/members.component';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss']
})
export class TrainersComponent {
  displayedColumns = ['name', 'specialization', 'experience'];
  trainers = [
    { name: 'Amit Singh', specialization: 'Weight Training', experience: 5 },
    { name: 'Priya Mehta', specialization: 'Yoga', experience: 3 },
    { name: 'Rohit Sharma', specialization: 'CrossFit', experience: 4 }
  ];
}