import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserManagementComponent } from './modal-user-management.component';

describe('ModalUserManagementComponent', () => {
  let component: ModalUserManagementComponent;
  let fixture: ComponentFixture<ModalUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
