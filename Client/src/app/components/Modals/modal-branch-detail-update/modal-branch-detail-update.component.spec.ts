import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBranchDetailUpdateComponent } from './modal-branch-detail-update.component';

describe('ModalBranchDetailUpdateComponent', () => {
  let component: ModalBranchDetailUpdateComponent;
  let fixture: ComponentFixture<ModalBranchDetailUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBranchDetailUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBranchDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
