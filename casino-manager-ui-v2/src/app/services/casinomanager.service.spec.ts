import { TestBed } from '@angular/core/testing';

import { CasinomanagerService } from './casinomanager.service';

xdescribe('CasinomanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CasinomanagerService = TestBed.get(CasinomanagerService);
    expect(service).toBeTruthy();
  });
});
