import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserStatusComponent } from './modal-user-status.component';

describe('ModalUserStatusComponent', () => {
  let component: ModalUserStatusComponent;
  let fixture: ComponentFixture<ModalUserStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUserStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
