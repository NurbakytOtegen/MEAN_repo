import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
  }

  private checkUserRole(): void {
    const roles = this.authService.getUserRoles();
    if (!roles.includes('ADMIN') && !roles.includes('SUPER_ADMIN')) {
      this.router.navigate(['/']);
      return;
    }
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users. Please try again later.';
        this.loading = false;
      }
    });
  }

  updateRole(userId: number, newRole: string): void {
    this.userService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating user role:', err);
      }
    });
  }

  toggleBlock(user: User): void {
    const action = user.is_blocked ? this.userService.unblockUser(user.id) : this.userService.blockUser(user.id);
    
    action.subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error toggling user block status:', err);
      }
    });
  }
}
