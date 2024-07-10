import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataPassingService {

  private CustomerNameData = new BehaviorSubject('');
  CustomerName = this.CustomerNameData.asObservable();

  private AllOwnersData = new BehaviorSubject([]);
  AllOwner = this.AllOwnersData.asObservable();

  private AllUserData = new BehaviorSubject([]);
  AllUser = this.AllUserData.asObservable();
  
  private AllBusinessData = new BehaviorSubject([]);
  AllBusiness = this.AllUserData.asObservable();

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

  UpdateAllOwnerData(Data: any[]) {
    this.AllOwnersData.next(Data);
 }

 UpdateAllUserData(Data: any[]) {
  this.AllUserData.next(Data);
}

UpdateAllBusinessData(Data: any[]) {
  this.AllBusinessData.next(Data);
}

UpdateAllBranchData(Data: any[]) {
  this.AllBranchData.next(Data);
}
}
