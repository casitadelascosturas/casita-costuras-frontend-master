import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddServiceDialogComponent } from './order-add-service-dialog.component';

describe('OrderAddServiceDialogComponent', () => {
  let component: OrderAddServiceDialogComponent;
  let fixture: ComponentFixture<OrderAddServiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAddServiceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAddServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
