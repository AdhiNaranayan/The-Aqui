/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SamplePopupComponent } from './sample-popup.component';

describe('SamplePopupComponent', () => {
  let component: SamplePopupComponent;
  let fixture: ComponentFixture<SamplePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
