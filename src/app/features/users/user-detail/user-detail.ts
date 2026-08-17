import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { delay } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './user-detail.html',
  styleUrl: '../../../../styles/user-list.css',
})
export class UserDetail implements OnInit {

  user?: User;
  isLoading = true;

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadUserData(+id);
      }
    });
  }

  private loadUserData(id: number): void {
    this.isLoading = true;
    this.userService.getUserById(id).pipe(delay(500)).subscribe({
      next: (response: any) => {
        this.user = response.data || response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
