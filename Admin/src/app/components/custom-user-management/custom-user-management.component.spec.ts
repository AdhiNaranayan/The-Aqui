import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUserManagementComponent } from './custom-user-management.component';

describe('CustomUserManagementComponent', () => {
  let component: CustomUserManagementComponent;
  let fixture: ComponentFixture<CustomUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
