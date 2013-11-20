exports.createChat = function(app,io,fs){
  io.sockets.on('connection', function (socket) {
    guestNumber++;
    var tmpName = "guest_" + guestNumber;
    nicknames[socket.id] = tmpName;
    socket.emit('nicknameChangeResult', {status: true, name: tmpName});
    joinRoom(socket, 'Main Room');
    socket.on('new message', function (data) {
       io.sockets.in(data.room).emit('message', { text: nicknames[socket.id] + ": " + data.text });
    });

    socket.on('nicknameChangeRequest', function (data) {
       if(!namesUsed[data.name]) {
         var user = nicknames[socket.id];
         var roomName = currentRooms[socket.id];
         removeUser(user,roomName);

         namesUsed[data.name] = data.name;
         nicknames[socket.id] = data.name;
         socket.emit('nicknameChangeResult', {status: true, name: data.name})

         listOfUsers[roomName].push(nicknames[socket.id] +'\n');
         io.sockets.in(roomName).emit('roomList',{users: listOfUsers[roomName]})
       }
       else
         socket.emit('nicknameChangeResult', {status: false, name: data.name})
    });

    socket.on('disconnect', function () {
      guestNumber--;
      var name = nicknames[socket.id];
      var room = currentRooms[socket.id];
      removeUser(name,room);
      delete namesUsed[name];
      delete nicknames[socket.id];
      io.sockets.emit('message', { text: 'User ' + name +  ' disconnected.' });
    });

    socket.on('changeRoom', function(data) {
      handleRoomChangeRequests(socket, data.room);
    });
  });

  var removeUser = function(user,roomName) {
    var index = listOfUsers[roomName].indexOf(user);
    listOfUsers[roomName].splice(index, 1);
    io.sockets.in(roomName).emit('roomList',{users: listOfUsers[roomName]})
  }

  var joinRoom = function(socket, roomName) {
    socket.join(roomName);
    socket.broadcast.to(roomName).emit('message', { text: 'User ' + nicknames[socket.id] + ' joined room.' });
    currentRooms[socket.id] = roomName;
    listOfUsers[roomName] = (listOfUsers[roomName] || []);
    listOfUsers[roomName].push(nicknames[socket.id] +'\n');
    io.sockets.in(roomName).emit('roomList',{users: listOfUsers[roomName]})
  }

  var handleRoomChangeRequests = function(socket, roomName) {
    var name = nicknames[socket.id];
    var room = currentRooms[socket.id];
    io.sockets.in(roomName).emit('message', { text: 'User ' + user +  ' left room.' });
    removeUser(name,room);
    socket.leave(currentRooms[socket.id]);
    joinRoom(socket, roomName);
  }
}

var guestNumber = 1;
var nicknames = {};
var namesUsed = {};
var currentRooms = {};
var listOfUsers = {};



