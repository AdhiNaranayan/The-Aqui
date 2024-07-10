import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIndustryStatusComponent } from './modal-industry-status.component';

describe('ModalIndustryStatusComponent', () => {
  let component: ModalIndustryStatusComponent;
  let fixture: ComponentFixture<ModalIndustryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIndustryStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIndustryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
