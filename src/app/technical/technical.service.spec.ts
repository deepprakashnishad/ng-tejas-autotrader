/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TechnicalService } from './technical.service';

describe('Service: Technical', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechnicalService]
    });
  });

  it('should ...', inject([TechnicalService], (service: TechnicalService) => {
    expect(service).toBeTruthy();
  }));
});
