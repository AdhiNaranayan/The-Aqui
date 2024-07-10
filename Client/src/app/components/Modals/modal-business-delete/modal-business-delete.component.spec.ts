import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusinessDeleteComponent } from './modal-business-delete.component';

describe('ModalBusinessDeleteComponent', () => {
  let component: ModalBusinessDeleteComponent;
  let fixture: ComponentFixture<ModalBusinessDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusinessDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBusinessDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
