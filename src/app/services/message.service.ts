import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly messageSource = new BehaviorSubject<string | null>(null);
  currentMessage = this.messageSource.asObservable();

  setMessage(message: string) {
    this.messageSource.next(message);
  }

  clearMessage() {
    this.messageSource.next(null);
  }
}
