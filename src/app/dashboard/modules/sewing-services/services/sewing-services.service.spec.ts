/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { SewingServicesService } from './sewing-services.service';

describe('Service: SewingServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SewingServicesService]
    });
  });

  it('should ...', inject([SewingServicesService], (service: SewingServicesService) => {
    expect(service).toBeTruthy();
  }));
});
