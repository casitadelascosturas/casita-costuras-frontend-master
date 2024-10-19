import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFilterInputDateComponent } from './crud-filter-input-date.component';

describe('CrudFilterInputDateComponent', () => {
  let component: CrudFilterInputDateComponent;
  let fixture: ComponentFixture<CrudFilterInputDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudFilterInputDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudFilterInputDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
