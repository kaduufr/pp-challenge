import {TestBed} from '@angular/core/testing';

import {DashboardService} from './dashboard.service';
import {PaymentDTO} from '../../../core/DTO/paymentDTO';
import {HttpTestingController, provideHttpClientTesting, TestRequest} from '@angular/common/http/testing';
import {GetTaskListResponseType} from '../../interfaces/get-task-list-response.type';
import {GetPaymentListResponseType} from '../../interfaces/get-payment-list-response.type';
import {provideHttpClient} from '@angular/common/http';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  const mockPayment: Partial<PaymentDTO> = {
    id: 1,
    name: 'Test Payment',
    username: 'user1',
    date: new Date(),
    isPayed: false,
    value: 100,
    image: 'image.jpg',
    title: 'Title',
  };

  const mockPaymentWithoutId: Omit<PaymentDTO, 'id'> = mockPayment as Omit<PaymentDTO, 'id'>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DashboardService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPayments', () => {
    it('should fetch payment list with pagination', () => {
      const mockResponse: GetTaskListResponseType = {
        data: [
          {
            id: 1,
            name: 'Test 1',
            username: 'user1',
            date: '2024-01-01',
            isPayed: false,
            value: 100,
            image: 'image.jpg',
            title: 'Title',
          },
          {
            id: 2,
            name: 'Test 2',
            username: 'user2',
            date: '2024-01-02',
            isPayed: true,
            value: 200,
            image: 'image.jpg',
            title: 'Title',
          },
        ],
        first: 1,
        items: 2,
        pages: 1,
      };

      service.getPaymentList(1, 10).subscribe((result: GetPaymentListResponseType) => {
        expect(result.data.length).toBe(2);
        expect(result.data[0] instanceof PaymentDTO).toBeTrue();
        expect(result._pagination.currentPage).toBe(1);
      });

      const req: TestRequest = httpMock.expectOne('/tasks?_page=1&_per_page=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch payments by username', () => {
      const mockPayments: PaymentDTO[] = [
        {
          id: 1,
          name: 'Test 1',
          username: 'user1',
          date: new Date(),
          isPayed: false,
          value: 100,
          image: 'image.jpg',
          title: 'Title',
        },
      ];

      service.getPaymentByUsername('user1').subscribe((payments) => {
        expect(payments.length).toBe(1);
        expect(payments[0].username).toBe('user1');
      });

      const req = httpMock.expectOne('/tasks?username=user1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPayments);
    });
  });

  describe('addPayment', () => {
    it('should add a payment and handle errors', () => {

      service.addPayment(mockPaymentWithoutId).subscribe((payment) => {
        expect(payment.id).toBe(1);
        expect(payment.name).toBe('Test Payment');
      });

      const responsePayment: PaymentDTO = {...mockPayment, id: 1} as PaymentDTO

      const req: TestRequest = httpMock.expectOne('/tasks');
      expect(req.request.method).toBe('POST');
      req.flush(responsePayment);
    });

    it('should handle error during addPayment', () => {

      service.addPayment(mockPaymentWithoutId).subscribe({
        error: (error) => {
          expect(error).toBe('E500: Erro ao adicionar pagamento');
        },
      });

      const req: TestRequest = httpMock.expectOne('/tasks');
      req.flush('Erro de validação', {status: 500, statusText: 'Internal Server Error'});
    });
  });

  describe('deletePayment', () => {
    it('should delete a payment by ID', () => {
      service.deletePayment(1).subscribe((response) => {
        expect(response).toBeNull()
      });

      const req = httpMock.expectOne('/tasks/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('editPayment', () => {

    const mockPaymentChanged = {
      ...mockPayment,
      name: 'Changed Payment',
    }

    it('should edit a payment and handle errors', () => {

      service.editPayment(mockPaymentChanged as PaymentDTO).subscribe((payment) => {
        expect(payment.id).toBe(1);
        expect(payment.name).toBe('Test Payment');
      });

      const req = httpMock.expectOne('/tasks/1');
      expect(req.request.method).toBe('PUT');
      req.flush(mockPayment);
    });

    it('should handle error during editPayment', () => {
      service.editPayment(mockPaymentChanged as PaymentDTO).subscribe({
        error: (error) => {
          expect(error).toBe('E500: Erro ao editar pagamento');
        },
      });

      const req = httpMock.expectOne('/tasks/1');
      req.flush('Erro interno', {status: 500, statusText: 'Internal Server Error'});
    });

    it('should toggle paid payment status', () => {

      const updatedPayment = {...mockPayment, isPayed: true};

      service.updatePaymentStatus(mockPayment as PaymentDTO).subscribe((payment) => {
        expect(payment.isPayed).toBeTrue();
      });

      const req = httpMock.expectOne('/tasks/1');
      expect(req.request.method).toBe('PUT');
      req.flush(updatedPayment);
    });
  });
});
