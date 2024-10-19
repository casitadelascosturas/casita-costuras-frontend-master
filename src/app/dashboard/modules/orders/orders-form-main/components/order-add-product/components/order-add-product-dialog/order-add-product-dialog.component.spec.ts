import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddProductDialogComponent } from './order-add-product-dialog.component';

describe('OrderAddProductDialogComponent', () => {
  let component: OrderAddProductDialogComponent;
  let fixture: ComponentFixture<OrderAddProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAddProductDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAddProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
