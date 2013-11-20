(function(root){
  var ChatUI = root.ChatUI = (root.ChatUI || {})

  var getMessage = ChatUI.getMessage = function(){
    return _.escape($('#message-box').val());
  }

  var writeMessage = ChatUI.writeMessage = function(message){
     $(".chat-room").prepend('\n' + message);
  }

  var chatRoom = ChatUI.chatRoom = 'Main Room';
})(this);

$(document).ready(function() {
  var socket = io.connect('http://localhost:3000');
  socket.on('message', function (data) {
    console.log(data);
    ChatUI.writeMessage(data.text);
  });

  socket.on('nicknameChangeResult', function(data) {
    if(data.status) {
      ChatUI.name = data.name;
      ChatUI.writeMessage(data.name);
    }
    else
      ChatUI.writeMessage('Could not set nickname.');
  });

  socket.on('roomList', function(data) {
    $('.room-list').html(data.users);
  });

  $('#message-button').on('click', function(event){
    event.preventDefault();
    ChatApp.sendMessage(ChatUI.getMessage(), socket);
  });
});