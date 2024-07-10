import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDataPassingService {

  private AllBusinessData = new BehaviorSubject([]);
  AllBusiness = this.AllBusinessData.asObservable();

  private AllCustomerData = new BehaviorSubject([]);
  AllCustomer = this.AllCustomerData.asObservable();

  private AllBranchData = new BehaviorSubject([]);
  AllBranch = this.AllBranchData.asObservable();


  constructor() { }


  UpdateAllBusinessData(Data: any[]) {
    this.AllBusinessData.next(Data);
  }

  UpdateAllBranchData(Data: any[]) {
    this.AllBranchData.next(Data);
  }

  UpdateAllCustomerData(Data: any[]) {
    this.AllCustomerData.next(Data);
  }
}
