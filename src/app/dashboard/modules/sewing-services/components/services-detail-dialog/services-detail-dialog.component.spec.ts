import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDetailDialogComponent } from './services-detail-dialog.component';

describe('ServicesDetailDialogComponent', () => {
  let component: ServicesDetailDialogComponent;
  let fixture: ComponentFixture<ServicesDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
