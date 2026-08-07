import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  isSidebarOpen = signal(true);

  sidenavMode = signal<'side' | 'over'>('side');

  toggleSidebar() {
    this.isSidebarOpen.update(value => !value);
  }

  openSidebar() {
    this.isSidebarOpen.set(true);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  setMode(mode: 'side' | 'over') {
    this.sidenavMode.set(mode);
  }

}