import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../components/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private dialog: MatDialog) { }

  show(): void {
    this.dialog.open(LoadingComponent, {
      disableClose: true,
      panelClass: 'transparent',
    });
  }

  hide(): void {
    this.dialog.closeAll();
  }
}
