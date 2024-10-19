import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFilterInputComponent } from './crud-filter-input.component';

describe('CrudFilterInputComponent', () => {
  let component: CrudFilterInputComponent;
  let fixture: ComponentFixture<CrudFilterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudFilterInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudFilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
