import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusinessComponent } from './modal-business.component';

describe('ModalBusinessComponent', () => {
  let component: ModalBusinessComponent;
  let fixture: ComponentFixture<ModalBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
