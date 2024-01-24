import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCreateChatroomComponent } from './join-create-chatroom.component';

describe('JoinCreateChatroomComponent', () => {
  let component: JoinCreateChatroomComponent;
  let fixture: ComponentFixture<JoinCreateChatroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinCreateChatroomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinCreateChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
