import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessDataPassingService {

  private CustomerNameData = new BehaviorSubject('');
  CustomerName = this.CustomerNameData.asObservable();

  private AllBusinessData = new BehaviorSubject([]);
  AllBusiness = this.AllBusinessData.asObservable();

  private AllBranchData = new BehaviorSubject([]);
  AllBranch = this.AllBranchData.asObservable();

  private CustomerUniqueData = new BehaviorSubject('');
  CustomerUnique = this.CustomerUniqueData.asObservable();

  constructor() { }
  GetOwnerDetails(Data: any) {
    this.CustomerNameData.next(Data);
  }

  GetUserDetails(Data: any) {
    this.CustomerNameData.next(Data);
  }

  UpdateCustomerUniqueData(Data: any) {
    this.CustomerUniqueData.next(Data);
  }


UpdateAllBusinessData(Data: any[]) {
  this.AllBusinessData.next(Data);
}

UpdateAllBranchData(Data: any[]) {
  this.AllBranchData.next(Data);
}
}
