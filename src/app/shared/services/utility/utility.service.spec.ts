import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sort array asc ', () => {
    const array: {name: string}[] = [{ name: 'b' }, { name: 'a' }, { name: 'c' }];
    const sorted: {name: string}[] = service.sort(array, 'name', 'asc');
    expect(sorted[0].name).toBe('a');
    expect(sorted[1].name).toBe('b');
    expect(sorted[2].name).toBe('c');
  });

  it('should sort array desc ', () => {
    const array: {name: string}[] = [{ name: 'b' }, { name: 'a' }, { name: 'c' }];
    const sorted: {name: string}[] = service.sort(array, 'name', 'desc');
    expect(sorted[0].name).toBe('c');
    expect(sorted[1].name).toBe('b');
    expect(sorted[2].name).toBe('a');
  });
});
