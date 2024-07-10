import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualBusinessDetailsComponent } from './individual-business-details.component';

describe('IndividualBusinessDetailsComponent', () => {
  let component: IndividualBusinessDetailsComponent;
  let fixture: ComponentFixture<IndividualBusinessDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualBusinessDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualBusinessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
