import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardImageDialogComponent } from './card-image-dialog.component';

describe('CardImageDialogComponent', () => {
  let component: CardImageDialogComponent;
  let fixture: ComponentFixture<CardImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardImageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
