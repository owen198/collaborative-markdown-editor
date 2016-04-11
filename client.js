(function () {
  var SocketIoAdapter = ot.SocketIOAdapter;
  var CodeMirrorAdapter = ot.CodeMirrorAdapter;
  var EditorClient = ot.EditorClient;
  var Socket;
  //==============================================
  //抓取GET 用的
  var strUrl = location.search;
  var getPara, ParaVal;
  var aryPara = [];
  if (strUrl.indexOf("?") != -1) {
    var getSearch = strUrl.split("?");
    getPara = getSearch[1].split("&");
    for (i = 0; i < getPara.length; i++) {
      ParaVal = getPara[i].split("=");
      aryPara.push(ParaVal[0]);
      aryPara[ParaVal[0]] = ParaVal[1];
    }

    //範例:
    //Url : http://localhost:5000/?id=1234
    //aryPara['id'] = 1234 
  }

  //Client socket.Io
    //接收(.on)
      //name : Url id
    //發送(.emit)
      //name : join
  //==============================================
  socket = io.connect('/');
  function Login(user, callback) {
    //發送
    socket.emit('join', { 
      //目前會員名稱是用亂數產生
      name: user
    })
  };
  socket.on('UserLogin', function (msg) {
    //$('.messages').append('<p>Sys'+msg+'</p>');
    alert(msg);
  });
  //接收來自id 的初始資料 
  //這段是設定Ot的預設值部分
  socket.on(aryPara['id'], function (data){
    InitCodeValue(
      data.str, 
      data.revision, 
      data.clients, 
      new SocketIoAdapter(socket)
    );
  })
  //================================================================
  //CodeMirror 部分 
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
      //新增CodeMirror 使用者
    });
  }
  RandomUser();
})();