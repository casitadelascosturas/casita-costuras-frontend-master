import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddProductComponent } from './order-add-product.component';

describe('OrderAddProductComponent', () => {
  let component: OrderAddProductComponent;
  let fixture: ComponentFixture<OrderAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAddProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
