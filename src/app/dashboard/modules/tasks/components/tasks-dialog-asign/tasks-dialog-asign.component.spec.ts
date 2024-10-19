import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDialogAsignComponent } from './tasks-dialog-asign.component';

describe('TasksDialogAsignComponent', () => {
  let component: TasksDialogAsignComponent;
  let fixture: ComponentFixture<TasksDialogAsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksDialogAsignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDialogAsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
