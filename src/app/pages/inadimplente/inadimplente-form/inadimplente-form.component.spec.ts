import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InadimplenteFormComponent } from './inadimplente-form.component';

describe('InadimplenteFormComponent', () => {
  let component: InadimplenteFormComponent;
  let fixture: ComponentFixture<InadimplenteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InadimplenteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InadimplenteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
