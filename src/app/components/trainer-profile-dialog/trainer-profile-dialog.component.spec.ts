import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerProfileDialogComponent } from './trainer-profile-dialog.component';

describe('TrainerProfileDialogComponent', () => {
  let component: TrainerProfileDialogComponent;
  let fixture: ComponentFixture<TrainerProfileDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerProfileDialogComponent]
    });
    fixture = TestBed.createComponent(TrainerProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
