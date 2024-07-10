import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBranchManagementComponent } from './modal-branch-management.component';

describe('ModalBranchManagementComponent', () => {
  let component: ModalBranchManagementComponent;
  let fixture: ComponentFixture<ModalBranchManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBranchManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBranchManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
