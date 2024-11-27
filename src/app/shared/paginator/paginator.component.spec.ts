import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.pagination = { currentPage: 1, totalItems: 100, totalPages: 10 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onPageChange', () => {
    it('should emit changePage event', () => {
      spyOn(component.changePageEvent, 'emit');

      component.onPageChange(3);

      expect(component.pagination.currentPage).toBe(3);
      expect(component.changePageEvent.emit).toHaveBeenCalledWith(3);
    });

    it('should not change page because page is invalid', () => {
      spyOn(component.changePageEvent, 'emit');

      component.onPageChange(11);

      expect(component.pagination.currentPage).toBe(1);
      expect(component.changePageEvent.emit).not.toHaveBeenCalled();
    });

    it('should not change page because page is the same', () => {
      spyOn(component.changePageEvent, 'emit');

      component.onPageChange(1);

      expect(component.pagination.currentPage).toBe(1);
      expect(component.changePageEvent.emit).not.toHaveBeenCalled();
    });
  });

  describe('changeNumberOfPages', () => {

    it('should return pages available when is near the start', () => {
      component.pagination.currentPage = 1;

      const pages = component.pagesToShow(5);

      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return pages available when is near the end', () => {
      component.pagination.currentPage = 8;

      const pages = component.pagesToShow(5);

      expect(pages).toEqual([6, 7, 8, 9, 10]);
    });

    it('should return pages available when is in the middle', () => {
      component.pagination.currentPage = 5;

      const pages = component.pagesToShow(5);

      expect(pages).toEqual([3, 4, 5, 6, 7]);
    });

  });
});
