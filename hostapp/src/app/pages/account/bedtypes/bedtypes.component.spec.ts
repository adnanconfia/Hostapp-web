import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedtypesComponent } from './bedtypes.component';

describe('BedtypesComponent', () => {
  let component: BedtypesComponent;
  let fixture: ComponentFixture<BedtypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BedtypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BedtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
