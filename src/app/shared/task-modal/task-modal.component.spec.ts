import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TaskModalComponent} from './task-modal.component';
import {DashboardService} from '../services/dashboard/dashboard.service';
import {of, throwError} from 'rxjs';
import {PaymentDTO} from '../../core/DTO/paymentDTO';
import {Modal} from 'bootstrap';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('TaskModalComponent', () => {
  let component: TaskModalComponent;
  let fixture: ComponentFixture<TaskModalComponent>;
  let httpClient: jasmine.SpyObj<HttpClient>;

  let dashboardService: DashboardService

  const taskMock = new PaymentDTO({
    id: 1,
    name: 'Task Name',
    username: 'User1',
    title: 'Test Title',
    value: 100,
    date: new Date(),
    image: 'image_url',
    isPayed: false,
  });

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TaskModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskModalComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    expect(component.form.contains('username')).toBeTrue();
    expect(component.form.get('username')?.validator).toBeTruthy();
    expect(component.form.get('title')?.validator).toBeTruthy();
    expect(component.form.get('value')?.validator).toBeTruthy();
    expect(component.form.get('date')?.validator).toBeTruthy();
    expect(component.form.get('name')?.validator).toBeTruthy();
  });

  it('should set error message when addTask fails', () => {
    spyOn(dashboardService, 'addPayment').and.returnValue(throwError(() => 'Erro ao adicionar'));
    component.addTask();
    expect(component.error).toBe('Erro ao adicionar');
  });

  it('should set successMessage on successful addTask', () => {
    spyOn(dashboardService, 'addPayment').and.returnValue(of<PaymentDTO>(taskMock));
    component.addTask();
    expect(component.successMessage).toBe('Pagamento adicionado com sucesso');
  });

  it('should set successMessage on successful editTask', () => {
    spyOn(dashboardService, 'editPayment').and.returnValue(of<PaymentDTO>(taskMock));
    component.editTask();
    expect(component.successMessage).toBe('Pagamento editado com sucesso');
  });

  it('should emit onPaymentEdited when a task is edited successfully', fakeAsync(() => {
    spyOn(component.onPaymentEdited, 'emit');
    spyOn(dashboardService, 'editPayment').and.returnValue(of(taskMock));

    component.modal = {
      hide: jasmine.createSpy('hide')
    } as any

    component.task = taskMock;
    component.editTask();
    expect(component.modal.hide).toBeDefined();
    tick(3000);
    expect(component.onPaymentEdited.emit).toHaveBeenCalledWith(taskMock);
    expect(component.modal.hide).toHaveBeenCalled();
    }
  ));
});
