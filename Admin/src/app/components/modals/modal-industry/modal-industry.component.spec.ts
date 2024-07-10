import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIndustryComponent } from './modal-industry.component';

describe('ModalIndustryComponent', () => {
  let component: ModalIndustryComponent;
  let fixture: ComponentFixture<ModalIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
