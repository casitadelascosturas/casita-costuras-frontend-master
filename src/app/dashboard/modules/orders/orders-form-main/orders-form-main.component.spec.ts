import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersFormMainComponent } from './orders-form-main.component';

describe('OrdersFormMainComponent', () => {
  let component: OrdersFormMainComponent;
  let fixture: ComponentFixture<OrdersFormMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersFormMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersFormMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
