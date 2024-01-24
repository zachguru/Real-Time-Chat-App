import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chatroom } from './chat.interface';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { environment } from 'src/environments/environment';
import { getHeaders } from '../services/auth.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;
  chatrooms: Chatroom[] = []
  message: string = "";
  visibleMessages: string[] = []
  user: string = sessionStorage.getItem("user") ?? ""
  selectedChatroom: Chatroom = {
    name: "",
    totalMembers: 0,
    _id: "",
    users: [],
  }
  displayJoinCreateChatroom: boolean = false
  firstMessageTimestamp: number = -1
  numberOfMessages: number = 0

  constructor(private http: HttpClient, public socket: Socket, private router: Router, private snackbar: SnackbarService) { }

  ngOnInit(): void {
    const url = `${environment.serverHost}/chatrooms`;

    // Utility method to get headers
    const headers = getHeaders()

    this.http.get<Chatroom[]>(url, { headers }).subscribe(
      response => {
        // If url succeeds, the result will be of array type
        // But if not, I know it's an error.
        this.didErrorOccur(response)
        this.chatrooms = response
      }
    );

    this.socketHandling()
  }

  // Method for handling chatroom selection
  selectChatroom(chatroom: Chatroom) {
    this.selectedChatroom = chatroom

    // Utility method to get headers
    const headers = getHeaders()

    this.http.get<string[]>(`${environment.serverHost}/recent/${this.selectedChatroom._id}`, { headers }).subscribe(
      response => {
        this.didErrorOccur(response)
        this.visibleMessages = response
      }
    )
  }

  sendMessage() {
    // Only in case input is not empty
    if (this.message != '') {
      this.socket.emit("send-message", {
        sender: this.user,
        context: this.message,
        receiver: this.selectedChatroom._id
      })
      // We need to handle memory usage
      // Arrays can be deadly for this issue, so in case we get to see 100 messages, we are just gonna delete first 20
      if (this.visibleMessages.length == 100) this.visibleMessages = this.visibleMessages.slice(20)
      if (this.checkMessageRateLimit()) {
        this.snackbar.showSnackbar(`Error: You sent too many messages in the last 60 seconds.`, true)
        return
      }
      this.visibleMessages.push(`${this.user}: ${this.message}`)
      this.message = ""
    }
  }

  joinChatroom(name: string) {
    const chatroom = {
      name: name,
      users: [this.user]
    }
    this.socket.emit("chatroom-created", (chatroom))
  }

  leaveChatroom(event: Event, roomName: string) {
    event.stopPropagation()
    this.socket.emit("leaving-chatroom", {
      user: this.user,
      roomName: roomName
    })
    if (this.selectedChatroom.name == roomName) {
      this.selectedChatroom.name = ''
      this.selectedChatroom.users = []
      this.selectedChatroom._id = ''
    }
  }

  socketHandling() {
    this.socket.on("chat-message", (message: string) => {
      this.visibleMessages.push(message)
    })

    // When a new user joins a certain channel, and someone is already chatting in that channel
    // we want to notify that someone else has joined.
    this.socket.on("user-connected", (data: any) => {
      if (data.chatroomName == this.selectedChatroom.name) {
        this.visibleMessages.push(data.user + " joined chatroom.")
      }
    })

    this.socket.on("user-disconnected", (data: any) => {
      if (data.chatroomName == this.selectedChatroom.name) {
        this.visibleMessages.push(data.user + " left.")
      }
    })

    this.socket.on("refresh-chatrooms", (interactingUser: string) => {
      const url = `${environment.serverHost}/chatrooms`;

      // Utility method to get headers
      const headers = getHeaders()

      this.http.get<Chatroom[]>(url, { headers }).subscribe(
        response => {
          this.didErrorOccur(response)
          this.chatrooms = response
          if (this.selectedChatroom.name != "") {
            const updatedChatroom = this.chatrooms.find(chatroom => chatroom.name == this.selectedChatroom.name)
            if (updatedChatroom) this.selectedChatroom = updatedChatroom
          }
        }
      );

    })
  }

  showJoinCreateChatroom() {
    this.displayJoinCreateChatroom = !this.displayJoinCreateChatroom
  }


  didErrorOccur(response: any) {
    if (!Array.isArray(response)) {
      this.router.navigate(["/login"])
    }
  }
  checkMessageRateLimit(): boolean {
    const currentTime = Date.now();

    if (this.firstMessageTimestamp === -1) {
      this.firstMessageTimestamp = currentTime;
      this.numberOfMessages++;
      return false;
    }

    if (currentTime > this.firstMessageTimestamp + 60000) {
      this.firstMessageTimestamp = -1;
      this.numberOfMessages = 1;
      return false;
    }

    if (this.numberOfMessages > 9) {
      return true;
    }

    this.numberOfMessages++;
    return false;
  }

}