import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNotificationDetailedViewComponent } from './modal-notification-detailed-view.component';

describe('ModalNotificationDetailedViewComponent', () => {
  let component: ModalNotificationDetailedViewComponent;
  let fixture: ComponentFixture<ModalNotificationDetailedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNotificationDetailedViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNotificationDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
