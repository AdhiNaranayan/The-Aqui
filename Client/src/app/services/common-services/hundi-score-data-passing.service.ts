
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HundiScoreDataPassingService {

  private AllMyBusinessData = new BehaviorSubject([]);
  AllMyBusiness = this.AllMyBusinessData.asObservable();


  constructor() { }

  UpdateAllMyBusinessData(Data: any[]) {
    this.AllMyBusinessData.next(Data);
  }
}

