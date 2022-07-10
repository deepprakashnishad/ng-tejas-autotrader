/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InstrumentService } from './instrument.service';

describe('Service: Instrument', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstrumentService]
    });
  });

  it('should ...', inject([InstrumentService], (service: InstrumentService) => {
    expect(service).toBeTruthy();
  }));
});
