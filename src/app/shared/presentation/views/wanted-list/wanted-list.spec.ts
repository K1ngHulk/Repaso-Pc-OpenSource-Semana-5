import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WantedList } from './wanted-list';

describe('WantedList', () => {
  let component: WantedList;
  let fixture: ComponentFixture<WantedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WantedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WantedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
