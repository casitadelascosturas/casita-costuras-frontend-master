import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersViewDetailsComponent } from './orders-view-details.component';

describe('OrdersViewDetailsComponent', () => {
  let component: OrdersViewDetailsComponent;
  let fixture: ComponentFixture<OrdersViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersViewDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
