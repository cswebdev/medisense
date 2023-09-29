import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationsListComponent } from './medications-list.component';

describe('MedicationsListComponent', () => {
  let component: MedicationsListComponent;
  let fixture: ComponentFixture<MedicationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicationsListComponent]
    });
    fixture = TestBed.createComponent(MedicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
