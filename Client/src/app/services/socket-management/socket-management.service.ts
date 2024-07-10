import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
const DevURL = 'http://localhost:3002/';
const StageURL = 'http://hundi.pptssolutions.com/';
const TempURL = 'http://hundi.pptssolutions.com/';

@Injectable({
  providedIn: 'root'
})
export class SocketManagementService {

  private socket: any;
  constructor() { }

  Initiate(data: any) {
    // this.socket = io.connect(DevURL, {secure: true});
    // this.socket.on('connection', (msg: any) => {
    //    const SocketData = this.socket.emit('Recovery', data);
    // });

  }
}
