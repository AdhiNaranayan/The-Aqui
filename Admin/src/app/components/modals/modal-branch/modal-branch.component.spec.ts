import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBranchComponent } from './modal-branch.component';

describe('ModalBranchComponent', () => {
  let component: ModalBranchComponent;
  let fixture: ComponentFixture<ModalBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
