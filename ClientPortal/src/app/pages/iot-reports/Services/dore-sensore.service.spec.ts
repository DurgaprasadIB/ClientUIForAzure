import { TestBed, inject } from '@angular/core/testing';

import { DoreSensoreService } from './dore-sensore.service';

describe('DoreSensoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoreSensoreService]
    });
  });

  it('should be created', inject([DoreSensoreService], (service: DoreSensoreService) => {
    expect(service).toBeTruthy();
  }));
});
