import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePaymentModalComponent } from './delete-payment-modal.component';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {DashboardService} from '../../core/services/dashboard/dashboard.service';
import {PaymentDTO} from '../../core/DTO/paymentDTO';
import {of, throwError} from 'rxjs';
import {provideHttpClient} from '@angular/common/http';

describe('DeletePaymentModalComponent', () => {
  let component: DeletePaymentModalComponent;
  let fixture: ComponentFixture<DeletePaymentModalComponent>;
  let dashboardService: DashboardService;
  let deletePaymentEventSpy: jasmine.Spy;

  const paymentSelected: PaymentDTO = {
    id: 1,
    name: 'Test Payment',
    amount: 100,
    date: new Date(),
    image: '',
    title: "Test Payment",
    isPayed: false,
    username: "user1",
    value: 500.20
  } as PaymentDTO;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [DeletePaymentModalComponent],
      providers: [DashboardService, provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeletePaymentModalComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    deletePaymentEventSpy = spyOn(component.deletePaymentEvent, 'emit');


    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate if data have paymentData before open modal', () => {
    component.open(paymentSelected);
    expect(component.data).toBe(paymentSelected);
  });


  it('should delete payment with success', () => {
    component.modal = {
      hide: jasmine.createSpy('hide')
    } as any

    spyOn(dashboardService, 'deletePayment').and.returnValue(of(null));
    component.deletePayment(paymentSelected);

    expect(dashboardService.deletePayment).toHaveBeenCalledWith(paymentSelected.id);
    expect(deletePaymentEventSpy).toHaveBeenCalledWith(paymentSelected);
    expect(component.error).toBe('');
  });

  it('should set error when delete fail', () => {

    spyOn(dashboardService, 'deletePayment').and.returnValue(throwError(() => new Error('Error'))); // Mock error response

    component.deletePayment(paymentSelected);

    expect(component.error).toBe('Erro ao deletar pagamento');
  });
});
