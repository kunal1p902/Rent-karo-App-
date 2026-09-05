import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  private newBooking$ = new Subject<any>();
  private bookingStatus$ = new Subject<any>();
  private vehicleUpdates$ = new Subject<any>();
  private chatMessage$ = new Subject<any>();

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = '3000';
    const serverUrl = `${protocol}//${host}:${port}`;

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('⚡ Socket connected with ID:', this.socket.id);
      this.joinUserRoom();
      this.socket.emit('join_vehicle_updates');
    });

    // Listen for events
    this.socket.on('new_booking', (data) => {
      console.log('⚡ Real-time Event: new_booking', data);
      this.toast.info(data.message || '⚡ New Booking Request Received!');
      this.playNotificationSound();
      this.newBooking$.next(data);
    });

    this.socket.on('booking_status_updated', (data) => {
      console.log('⚡ Real-time Event: booking_status_updated', data);
      this.toast.success(data.message || '⚡ Booking status updated!');
      this.playNotificationSound();
      this.bookingStatus$.next(data);
    });

    this.socket.on('vehicle:availability_updated', (data) => {
      this.vehicleUpdates$.next(data);
    });

    this.socket.on('receive_chat_message', (data) => {
      this.chatMessage$.next(data);
    });
  }

  public joinUserRoom() {
    const user = this.auth.getCurrentUser() as any;
    if (user && user.role) {
      this.socket.emit('join_room', { role: user.role, id: user.id || user._id });
    }
  }

  private playNotificationSound() {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}
  }

  public onNewBooking(): Observable<any> {
    return this.newBooking$.asObservable();
  }

  public onBookingStatusUpdated(): Observable<any> {
    return this.bookingStatus$.asObservable();
  }

  public onVehicleAvailabilityUpdated(): Observable<any> {
    return this.vehicleUpdates$.asObservable();
  }

  public onChatMessage(): Observable<any> {
    return this.chatMessage$.asObservable();
  }

  public sendChatMessage(messageData: any) {
    if (this.socket) {
      this.socket.emit('send_chat_message', messageData);
    }
  }
}
