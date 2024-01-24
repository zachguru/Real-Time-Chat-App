import { Component, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SnackbarService } from '../services/snackbar.service';


@Component({
  selector: 'app-join-create-chatroom',
  templateUrl: './join-create-chatroom.component.html',
  styleUrls: ['./join-create-chatroom.component.css']
})
export class JoinCreateChatroomComponent {

  @Input() public joinChatroom: (name: string) => void = () => { }
  @Input() public user: string = ""
  @Input() public socket: Socket | null = null

  chatroomName: string = ""

  constructor(private snackbar: SnackbarService) {

  }


  joinChatroomOnClick() {
    if (this.chatroomName.length <= 4 || this.chatroomName.indexOf(' ') > 0) {
      this.snackbar.showSnackbar(`Error: Chatroom name must be 5-20 characters long and must not contain whitespaces.`, true)
      return
    }
    const chatroom = {
      name: this.chatroomName,
      users: [this.user],
      totalMembers: 1
    }
    this.socket?.emit("chatroom-created", (chatroom))
    this.chatroomName = ''
    this.snackbar.showSnackbar(`Success. New chatroom has been added to My Chatrooms list.`, false)
  }
}
