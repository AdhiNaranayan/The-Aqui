import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInviteStatusApprovalComponent } from './modal-invite-status-approval.component';

describe('ModalInviteStatusApprovalComponent', () => {
  let component: ModalInviteStatusApprovalComponent;
  let fixture: ComponentFixture<ModalInviteStatusApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInviteStatusApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInviteStatusApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
