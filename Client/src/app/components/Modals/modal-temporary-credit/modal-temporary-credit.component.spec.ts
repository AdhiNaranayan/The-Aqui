import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTemporaryCreditComponent } from './modal-temporary-credit.component';

describe('ModalTemporaryCreditComponent', () => {
  let component: ModalTemporaryCreditComponent;
  let fixture: ComponentFixture<ModalTemporaryCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTemporaryCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTemporaryCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
