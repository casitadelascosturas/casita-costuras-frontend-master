import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddServiceComponent } from './order-add-service.component';

describe('OrderAddServiceComponent', () => {
  let component: OrderAddServiceComponent;
  let fixture: ComponentFixture<OrderAddServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAddServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAddServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
