import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAndBranchesComponent } from './business-and-branches.component';

describe('BusinessAndBranchesComponent', () => {
  let component: BusinessAndBranchesComponent;
  let fixture: ComponentFixture<BusinessAndBranchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAndBranchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAndBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
