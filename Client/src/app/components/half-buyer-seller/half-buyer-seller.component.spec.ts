/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HalfBuyerSellerComponent } from './half-buyer-seller.component';

describe('HalfBuyerSellerComponent', () => {
  let component: HalfBuyerSellerComponent;
  let fixture: ComponentFixture<HalfBuyerSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HalfBuyerSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HalfBuyerSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
