import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessBranchDashboardComponent } from './business-branch-dashboard.component';

describe('BusinessBranchDashboardComponent', () => {
  let component: BusinessBranchDashboardComponent;
  let fixture: ComponentFixture<BusinessBranchDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessBranchDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessBranchDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
