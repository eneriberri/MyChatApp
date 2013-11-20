(function(root){
  var ChatApp = root.ChatApp = (root.ChatApp || {})

  var processCommand = ChatApp.processCommand = function(message,socket){
    var command = message.split(' ')[0];
    if(command == 'nick') {
      socket.emit('nicknameChangeRequest', {name: message.substring(5)});
    }
    else if(command == 'join') {
      socket.emit('changeRoom', {room: message.substring(5)});
      ChatUI.chatRoom = message.substring(5);
    }
    else {
      ChatUI.writeMessage('Command not found.');
    }
  }

  var sendMessage = ChatApp.sendMessage = function(message, socket){
    if(message.substring(0,1) === "\\") {
      processCommand(message.substring(1),socket)
    }
    else {
      socket.emit('new message', { text: message, room: ChatUI.chatRoom });
    }
  };
})(this);