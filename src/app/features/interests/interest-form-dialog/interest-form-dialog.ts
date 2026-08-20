import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-interest-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './interest-form-dialog.html',
  styleUrl: '../../../../styles/_interest-form-dialog.css'
})
export class InterestFormDialog {
  interestForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InterestFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data?.interest;
    this.interestForm = this.fb.group({
      interestName: [data?.interest?.interestName || '', Validators.required],
      active: [data?.interest?.active || 'A', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.interestForm.valid) {
      this.dialogRef.close(this.interestForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
