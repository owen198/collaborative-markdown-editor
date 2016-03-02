(function () {
  var SocketIoAdapter = ot.SocketIOAdapter;
  var CodeMirrorAdapter = ot.CodeMirrorAdapter;
  var EditorClient = ot.EditorClient;
  var Socket;
  
  socket = io.connect('/');
  socket.on('doc', function (data){
    InitCodeValue(
      data.str, 
      data.revision, 
      data.clients, 
      new SocketIoAdapter(socket)
    );
  })

  function Login(user, callback) {
    socket.emit('UserLogin', { 
      name: user 
    })
    socket.on('UserLoginData', callback);
  };

  function InitCodeValue (str, revision, clients, serverAdapter) {
    editor.setValue(str);
      CodeMirrorClient = window.CodeMirrorClient = 
      new EditorClient(
        revision, 
        clients,
        serverAdapter, 
        new CodeMirrorAdapter(editor)
      );
  }
  
  function RandomUser(){
    var user = Math.floor( Math.random() * (100 - 1 + 1) ) + 1;
    Login(user, function () {
      CodeMirrorClient.serverAdapter.ownUserName = user;
    });
  }
  
  RandomUser();
})();