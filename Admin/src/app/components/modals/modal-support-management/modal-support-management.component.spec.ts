import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSupportManagementComponent } from './modal-support-management.component';

describe('ModalSupportManagementComponent', () => {
  let component: ModalSupportManagementComponent;
  let fixture: ComponentFixture<ModalSupportManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSupportManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSupportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
