import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerThemeComponent } from './buyer-theme.component';

describe('BuyerThemeComponent', () => {
  let component: BuyerThemeComponent;
  let fixture: ComponentFixture<BuyerThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
