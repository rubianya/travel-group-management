import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Registration } from '../../../core/models/registration.model';
import { Group, TripGroupRequestDTO } from '../../../core/models/group.model';

export interface GroupDialogData {
  title: string;
  group?: Group;
  members?: Registration[];
}

@Component({
  selector: 'app-group-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './group-form-dialog.html',
  styleUrls: ['./group-form-dialog.scss']
})
export class GroupFormDialog {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<GroupFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GroupDialogData,
    private fb: FormBuilder
  ) {
    this.isEditMode = !!data.group;
    this.form = this.fb.group({
      groupName: [data.group?.groupName || '', Validators.required],
      note: [data.group?.note || ''],
      leaderId: [data.group?.leader?.id || null, Validators.required]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      const result: TripGroupRequestDTO = {
        groupName: this.form.value.groupName,
        note: this.form.value.note
      };
      if (this.form.value.leaderId) {
        result.leaderId = this.form.value.leaderId;
      }
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
