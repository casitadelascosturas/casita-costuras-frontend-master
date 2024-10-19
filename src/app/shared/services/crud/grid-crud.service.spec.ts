/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GridCrudService } from './grid-crud.service';

describe('Service: GridCrud', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridCrudService]
    });
  });

  it('should ...', inject([GridCrudService], (service: GridCrudService) => {
    expect(service).toBeTruthy();
  }));
});
