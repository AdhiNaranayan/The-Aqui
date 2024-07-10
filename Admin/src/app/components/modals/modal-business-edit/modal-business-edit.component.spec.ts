import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusinessEditComponent } from './modal-business-edit.component';

describe('ModalBusinessEditComponent', () => {
  let component: ModalBusinessEditComponent;
  let fixture: ComponentFixture<ModalBusinessEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusinessEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBusinessEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
