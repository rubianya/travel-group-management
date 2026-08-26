import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs';
import { TravelInterestResponseDTO } from '../../../core/models/interest.model';
import { InterestService } from '../../../core/services/interest.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InterestFormDialog } from '../interest-form-dialog/interest-form-dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-interest-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  templateUrl: './interest-list.html',
  styleUrl: '../../../../styles/_interest-list.css'
})
export class InterestList implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'isActive', 'actions'];
  interests: TravelInterestResponseDTO[] = [];
  isLoading = true;

  interestService = inject(InterestService);
  cdr = inject(ChangeDetectorRef);
  dialog = inject(MatDialog);


  ngOnInit(): void {
    this.loadInterests();
  }

  loadInterests(): void {
    Promise.resolve().then(() => {
      this.isLoading = true;
      this.cdr.detectChanges();
    });
    this.interestService.getAllInterests().pipe(delay(300)).subscribe({
      next: (response: any) => {
        this.interests = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading interests', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(InterestFormDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.interestService.createInterest(result).subscribe({
          next: () => {
            this.loadInterests();
          },
          error: (err) => {
            console.error('Error creating interest', err);
            alert('ไม่สามารถสร้างประเภทความสนใจได้');
          }
        });
      }
    });
  }

  onEdit(id: number): void {
    const existing = this.interests.find(i => i.id === id);
    if (!existing) return;

    const dialogRef = this.dialog.open(InterestFormDialog, {
      width: '400px',
      data: { interest: existing }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.interestService.updateInterest(id, result).subscribe({
          next: () => {
            this.loadInterests();
          },
          error: (err) => {
            console.error('Error updating interest', err);
            alert('ไม่สามารถแก้ไขประเภทความสนใจได้');
          }
        });
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('คุณต้องการลบประเภทความสนใจนี้ใช่หรือไม่?')) {
      const existing = this.interests.find(i => i.id === id);
      if (existing) {
        this.interestService.updateInterest(id, { interestName: existing.interestName, active: 'S' }).subscribe(() => {
          this.interests = this.interests.filter(i => i.id !== id);
          this.cdr.detectChanges();
        });
      }
    }
  }

  onToggleStatus(element: TravelInterestResponseDTO): void {
    const newStatus = element.active === 'A' ? 'I' : 'A';
    this.interestService.updateInterest(element.id, {
      interestName: element.interestName,
      active: newStatus
    }).subscribe({
      next: () => {
        element.active = newStatus;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error toggling interest status', err);
        alert('ไม่สามารถเปลี่ยนสถานะได้');
        this.loadInterests();
      }
    });
  }
}
