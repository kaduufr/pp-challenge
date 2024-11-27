import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardComponent} from './dashboard.component';
import {TaskModalComponent} from '../../shared/task-modal/task-modal.component';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {DashboardService} from '../../core/services/dashboard/dashboard.service';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {DeletePaymentModalComponent} from '../../shared/delete-payment-modal/delete-payment-modal.component';
import {of, throwError} from 'rxjs';
import {TaskModalTypeEnum} from '../../shared/task-modal/task-modal.enum';
import {provideHttpClient} from '@angular/common/http';
import {GetPaymentListResponseType} from '../../shared/interfaces/get-payment-list-response.type';
import {PaymentDTO} from '../../core/DTO/paymentDTO';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;

  const mockPayment: PaymentDTO = {
    id: 1,
    username: 'John Doe',
    title: 'Payment 1',
    isPayed: false,
    value: 100,
    date: new Date(),
    image: 'teste.png',
    name: "Teste"
  }

  const mockPaymentList: GetPaymentListResponseType = {
    data: [
      mockPayment
    ],
    _pagination: {totalItems: 1, totalPages: 1, currentPage: 1}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [DashboardComponent, TaskModalComponent, DeletePaymentModalComponent, ReactiveFormsModule],
      providers: [DashboardService, UtilityService, FormBuilder, provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load task list', () => {
    spyOn(dashboardService, 'getPaymentList').and.returnValue(of(mockPaymentList));
    component.ngOnInit();
    expect(dashboardService.getPaymentList).toHaveBeenCalled();
    expect(component.paymentList.length).toBe(1);
  });

  it('should handle error while loading task list', () => {
    const errorResponse: string = 'Erro ao carregar pagamentos';
    spyOn(dashboardService, 'getPaymentList').and.returnValue(throwError(() => new Error(errorResponse)));
    component.ngOnInit();
    expect(component.error).toBe(errorResponse);
  });

  it('should search payments by username', () => {
    spyOn(dashboardService, 'getPaymentByUsername').and.returnValue(of([mockPayment]));
    component.searchPayment('John Doe');
    expect(dashboardService.getPaymentByUsername).toHaveBeenCalledWith('John Doe');
    expect(component.paymentList.length).toBe(1);
  });

  it('should clear search and reset form', () => {
    spyOn(dashboardService, 'getPaymentList').and.returnValue(of(mockPaymentList));
    component.searchForm.setValue({username: 'John Doe'});
    component.searchPayment('John Doe');

    component.clearSearch();
    expect(component.filterApplied).toBeFalse();
    expect(component.searchForm.value).toEqual({username: null});
    expect(dashboardService.getPaymentList).toHaveBeenCalled();
  });

  it('should update paid status', () => {
    spyOn(dashboardService, 'updatePaymentStatus').and.returnValue(of(mockPayment));
    component.onCheckPaymentChange(mockPayment);
    expect(dashboardService.updatePaymentStatus).toHaveBeenCalled();
    expect(mockPayment.isPayed).toBeTrue();
  });

  it('should fail when update paid status', () => {
    const errorResponse: string = 'Erro ao atualizar pagamento';
    spyOn(dashboardService, 'updatePaymentStatus').and.returnValue(throwError(() => new Error(errorResponse)));
    component.onCheckPaymentChange(mockPayment);
    expect(component.error).toBe(errorResponse);
  });

  it('should open the modal for adding a task', () => {
    spyOn(component.taskModal, 'open');
    component.openModalHandlePayment(TaskModalTypeEnum.ADD);
    expect(component.taskModal.open).toHaveBeenCalled();
  });

  it('should handle items per page change', () => {
    spyOn(dashboardService, 'getPaymentList').and.returnValue(of(mockPaymentList));
    component.changeItemsPerPage({target: {value: '15'}} as unknown as Event);
    expect(component.pagination.itemsPerPage).toBe(15);
    expect(dashboardService.getPaymentList).toHaveBeenCalledWith(1, 15);
  });

});
