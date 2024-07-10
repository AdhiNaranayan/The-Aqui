import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAndBuyerConnectedComponent } from './seller-and-buyer-connected.component';

describe('SellerAndBuyerConnectedComponent', () => {
  let component: SellerAndBuyerConnectedComponent;
  let fixture: ComponentFixture<SellerAndBuyerConnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerAndBuyerConnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerAndBuyerConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
