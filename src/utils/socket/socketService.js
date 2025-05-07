import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://staging-api.choona.itechnolabs.tech'; // Replace with your server

class SocketService {
  constructor() {
    this.socket = null;
  }

  initializeSocket = async (userId) => {

    if (this.socket && this.socket.connected) {
      console.log('⚠️ Socket already connected');
      return Promise.resolve(this.socket);
    }

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_SERVER_URL, {
          transports: ['websocket'], // Important for React Native
          jsonp: false,
          extraHeaders: {
            token: userId,
          },
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket connected');
          resolve(this.socket);
        });

        this.socket.on('connect_error', (err) => {
          console.error('❌ Socket connection error:', err);
          reject(err);
        });
      } catch (error) {
        reject(error, 'its error');
      }
    });
  };

  emit(event, data = {}) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  off(event) {
    if (!this.socket) return;
    this.socket.off(event);
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    console.log('🔌 Socket disconnected');
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

const socketService = new SocketService();
export default socketService;









// import io from 'socket.io-client';
// import {socketUrl} from './urls';
// import {Alert} from 'react-native';

// class SocketService {
//   constructor() {
//     this.socket = null;
//   }

//   // Method to check if the socket is already connected
//   isConnected() {
//     return this.socket && this.socket.connected;
//   }

//   connect(user_id, url) {
//     if (this.isConnected()) {
//       console.log('Socket is already connected');
//       return;
//     }

//     this.socket = io(url || socketUrl, {
//       reconnectionAttempts: 3, // Retry 3 times
//       reconnectionDelay: 1000, // Wait 1 second before retrying
//       query: {
//         user_id: user_id,
//       },
//     });

//     this.socket.on('connect', () => {
//       console.log('Connected to socket server');
//       console.log(this.socket?.id, 'its socket id');

//       // Alert.alert('Connected to socket server');
//     });

//     this.socket.on('disconnect', () => {
//       console.log('Disconnected from socket server');
//       // Alert.alert('Disconnected from socket server');
//     });

//     this.socket.on('connect_error', error => {
//       console.error('Connection error:', error);
//     });

//     this.socket.on('reconnect_failed', () => {
//       console.error('Reconnection failed');
//     });
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       console.log('Socket disconnected');
//     }
//   }

//   emit(event, data) {
//     if (this.socket) {
//       this.socket.emit(event, data);
//     }
//   }

//   to(room) {
//     return {
//       emit: (event, data) => {
//         if (this.socket) {
//           this.socket.emit(event, {room, data});
//         }
//       },
//     };
//   }

//   on(event, callback) {
//     if (this.socket) {
//       this.socket.on(event, callback);
//     }
//   }

//   off(event, callback) {
//     if (this.socket) {
//       this.socket.off(event, callback);
//     }
//   }
// }

// const socketService = new SocketService();
// export default socketService;




/*************************************************************************use it like that*******************************/

// useEffect(() => {
//     // Listen for incoming messages
//     socketService.on('message_received', message => {
//       console.log(message, 'its received message');
//       if (message?.room_id == roomData?.id) {
//         const transformedMessage = transformMessage(message);
//         // setMessages(prevMessages => [...prevMessages, transformedMessage]);
//         setMessages(prevMessages =>
//           GiftedChat.append(prevMessages, [transformedMessage]),
//         );
//         console.log(message, 'this is new message new');
//         console.log(transformedMessage, 'this is new message');
//       }
//     });

//     // Cleanup function to remove the listener when the component unmounts
//     // return () => {
//     //   socketService.off('message_received');
//     // };

//     // return () => {
//     //   socketService.disconnect();
//     // };
//   }, []);
