import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBranchEditComponent } from './modal-branch-edit.component';

describe('ModalBranchEditComponent', () => {
  let component: ModalBranchEditComponent;
  let fixture: ComponentFixture<ModalBranchEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBranchEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBranchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
