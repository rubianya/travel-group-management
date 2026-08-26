import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Itinerary } from '../../../core/models/itinerary.model';

@Component({
  selector: 'app-itinerary-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './itinerary-form-dialog.html',
  styleUrls: ['./itinerary-form-dialog.css']
})
export class ItineraryFormDialog {
  itinerary: Itinerary = {
    tripId: 0,
    dayNo: 1,
    time: '08:00',
    title: '',
    location: ''
  };
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<ItineraryFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; itinerary?: Itinerary }
  ) {
    if (data.itinerary) {
      this.itinerary = { ...data.itinerary };
      this.isEditMode = true;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.itinerary.dayNo && this.itinerary.time && this.itinerary.title && this.itinerary.location) {
      if (this.itinerary.time.length === 5) {
          this.itinerary.time = this.itinerary.time + ':00';
      }
      this.dialogRef.close(this.itinerary);
    } else {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}
