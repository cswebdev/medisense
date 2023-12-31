import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPortalComponent } from './patient-portal.component';

describe('PatientPortalComponent', () => {
  let component: PatientPortalComponent;
  let fixture: ComponentFixture<PatientPortalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientPortalComponent]
    });
    fixture = TestBed.createComponent(PatientPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
