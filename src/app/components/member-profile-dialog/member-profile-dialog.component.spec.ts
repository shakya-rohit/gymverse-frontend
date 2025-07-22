import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberProfileDialogComponent } from './member-profile-dialog.component';

describe('MemberProfileDialogComponent', () => {
  let component: MemberProfileDialogComponent;
  let fixture: ComponentFixture<MemberProfileDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberProfileDialogComponent]
    });
    fixture = TestBed.createComponent(MemberProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
