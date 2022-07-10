/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StockSelectionService } from './stock-selection.service';

describe('Service: StockSelection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockSelectionService]
    });
  });

  it('should ...', inject([StockSelectionService], (service: StockSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
