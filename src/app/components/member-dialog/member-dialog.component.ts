import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemberService } from 'src/app/services/member.service';
import { MembershipPlanService } from 'src/app/services/membership-plan.service';

@Component({
  selector: 'app-member-dialog',
  templateUrl: './member-dialog.component.html'
})
export class MemberDialogComponent implements OnInit {
  memberForm!: FormGroup;
  plans: any[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private planService: MembershipPlanService,
    private dialogRef: MatDialogRef<MemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.memberForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      age: [this.data?.age || '', Validators.required],
      membership: [this.data?.membership || '', Validators.required],
      status: [this.data?.status || '', Validators.required],
      membershipPlanId: [this.data?.membershipPlanId || '', Validators.required],
    });

    this.loadPlans();
  }

  loadPlans() {
    this.planService.getAllPlans().subscribe({
      next: (res: any) => this.plans = res,
      error: err => console.error('Error loading plans', err)
    });
  }

  onSave() {
    if (this.memberForm.invalid) return;
    this.isSaving = true;

    const payload = this.memberForm.value;

    const save$ = this.data
      ? this.memberService.update(this.data.memberId, payload)
      : this.memberService.create(payload);

    save$.subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close(true); // tell parent to refresh
      },
      error: (err) => {
        console.error('Error saving member', err);
        this.isSaving = false;
      }
    });
  }

  onClose(){
    this.isSaving = false;
    this.dialogRef.close();
  }
}