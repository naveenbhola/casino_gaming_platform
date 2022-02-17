import { TestBed } from '@angular/core/testing';

import { TopologytreeService } from './topologytree.service';

xdescribe('TopologytreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopologytreeService = TestBed.get(TopologytreeService);
    expect(service).toBeTruthy();
  });
});
