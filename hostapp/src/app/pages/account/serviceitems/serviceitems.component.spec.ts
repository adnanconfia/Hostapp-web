import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceitemsComponent } from './serviceitems.component';

describe('ServiceitemsComponent', () => {
  let component: ServiceitemsComponent;
  let fixture: ComponentFixture<ServiceitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceitemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
