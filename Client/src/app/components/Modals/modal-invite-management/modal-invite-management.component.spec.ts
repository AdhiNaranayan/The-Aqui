import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInviteManagementComponent } from './modal-invite-management.component';

describe('ModalInviteManagementComponent', () => {
  let component: ModalInviteManagementComponent;
  let fixture: ComponentFixture<ModalInviteManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInviteManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInviteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
