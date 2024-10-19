import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { rolesResolver } from './roles.resolver';

describe('rolesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => rolesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
