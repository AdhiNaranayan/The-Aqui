import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryManagementComponent } from './temporary-management.component';

describe('TemporaryManagementComponent', () => {
  let component: TemporaryManagementComponent;
  let fixture: ComponentFixture<TemporaryManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporaryManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
