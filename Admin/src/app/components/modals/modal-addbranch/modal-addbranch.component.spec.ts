import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddbranchComponent } from './modal-addbranch.component';

describe('ModalAddbranchComponent', () => {
  let component: ModalAddbranchComponent;
  let fixture: ComponentFixture<ModalAddbranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddbranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddbranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
