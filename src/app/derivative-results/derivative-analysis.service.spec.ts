/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DerivativeAnalysisService } from './derivative-analysis.service';

describe('Service: Da', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DerivativeAnalysisService]
    });
  });

  it('should ...', inject([DerivativeAnalysisService], (service: DerivativeAnalysisService) => {
    expect(service).toBeTruthy();
  }));
});
