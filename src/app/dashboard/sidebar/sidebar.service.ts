import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isClosedSubject = new BehaviorSubject<boolean>(true);
  isClosed$ = this.isClosedSubject.asObservable();

  toggleSidebar(): void {
    this.isClosedSubject.next(!this.isClosedSubject.value);
  }
}
