/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TechnicalOperatorService } from './technical-operator.service';

describe('Service: TechnicalOperator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechnicalOperatorService]
    });
  });

  it('should ...', inject([TechnicalOperatorService], (service: TechnicalOperatorService) => {
    expect(service).toBeTruthy();
  }));
});
