import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryDataPassingService {

  private AllCategoryData = new BehaviorSubject([]);
  AllCategory = this.AllCategoryData.asObservable();

  constructor() { }


UpdateAllCategoryData(Data: any[]) {
  this.AllCategoryData.next(Data);
}
}
