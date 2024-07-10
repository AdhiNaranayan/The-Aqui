import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryManagementComponent } from './industry-management.component';

describe('IndustryManagementComponent', () => {
  let component: IndustryManagementComponent;
  let fixture: ComponentFixture<IndustryManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
