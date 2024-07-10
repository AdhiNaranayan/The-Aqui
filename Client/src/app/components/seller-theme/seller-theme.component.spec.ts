import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerThemeComponent } from './seller-theme.component';

describe('SellerThemeComponent', () => {
  let component: SellerThemeComponent;
  let fixture: ComponentFixture<SellerThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
