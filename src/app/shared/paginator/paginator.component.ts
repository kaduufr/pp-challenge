import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-paginator',
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {

  @Input() pagination!: { currentPage: number; totalItems: number; totalPages: number };


  @Output() changePageEvent = new EventEmitter<number>();
  constructor() {}

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages && page !== this.pagination.currentPage) {
      this.pagination.currentPage = page;
      this.changePageEvent.emit(page);

    }
  }

  pagesToShow(limitPages: number = 5): number[] {
    const pages: number[] = [];
    const halfLimit = Math.floor(limitPages / 2);

    const startPage = Math.max(1, Math.min(this.pagination.currentPage - halfLimit, this.pagination.totalPages - limitPages + 1));
    const endPage = Math.min(this.pagination.totalPages, startPage + limitPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

}
