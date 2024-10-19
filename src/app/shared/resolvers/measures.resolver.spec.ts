import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { measuresResolver } from './measures.resolver';

describe('measuresResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => measuresResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
