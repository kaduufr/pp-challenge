import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import {LoadingService} from '../services/loading/loading.service';
import {BehaviorSubject} from 'rxjs';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let isLoadingSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    isLoadingSubject = new BehaviorSubject<boolean>(false);

    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [], {
      isLoading: isLoadingSubject.asObservable(),
    });

    TestBed.configureTestingModule({
      declarations: [],
      imports: [LoadingComponent],
      providers: [
        {provide: LoadingService, useValue: loadingServiceSpy},
      ],
    });

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect the value of isLoading observable', (done) => {
    component.ngOnInit();

    isLoadingSubject.next(true);

    component.show.subscribe({
      next: (isLoading) => {
        expect(isLoading).toBeTrue();
        done()
      }
    });
  });
});
