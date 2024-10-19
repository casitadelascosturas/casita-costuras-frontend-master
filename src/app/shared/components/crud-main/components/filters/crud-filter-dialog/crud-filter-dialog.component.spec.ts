import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFilterDialogComponent } from './crud-filter-dialog.component';

describe('CrudFilterDialogComponent', () => {
  let component: CrudFilterDialogComponent;
  let fixture: ComponentFixture<CrudFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudFilterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
