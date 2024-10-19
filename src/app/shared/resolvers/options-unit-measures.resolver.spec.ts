import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { optionsUnitMeasuresResolver } from './options-unit-measures.resolver';

describe('optionsUnitMeasuresResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => optionsUnitMeasuresResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
