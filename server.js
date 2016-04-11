var ExpressLibrary = require('express');                 
var ExpressClient = ExpressLibrary();                           
var ExpressRouter = ExpressLibrary.Router();

var ServeStaticLibrary = require('serve-static');        
var PathLibrary = require('path');                       
var HttpLibrary = require('http');                       

var OtLibrary = require('ot');                           
var SocketIoLibrary = require('socket.io');              

var HttpClientServer = HttpLibrary.createServer(ExpressClient);

//路由設定====================================================
//連線到http://localhost:5000 會將檔案index.html給User
ExpressRouter.get('/', function(req, res) {
  FileKey = req.query;	
  //Url 的資料
  res.sendFile(PathLibrary.join(__dirname + '/index.html'));	
})
ExpressClient.use(ExpressLibrary.static(__dirname + '/'));
ExpressClient.use('/', ExpressRouter);
//=====================================================

var CodeValue = "ke it fit in URLs";							
//File Code		
var SocketoIoListen = SocketIoLibrary.listen(HttpClientServer);
//將 SocketoIo 啟動並綁在Http服務上


//function 位置 editor-socketio-server.js
var Ot = 
 new OtLibrary.EditorSocketIOServer(
    CodeValue, 									//document
    [], 										//operations
    'text', 									//docId
    function(socket, ClientData){				//mayWrite
      ClientData(!!socket.mayEdit);
    }
  );
//=====================================================
var roomUser = {  };
SocketoIoListen.on('connection', function (socket){
  //處理Url Get Data 取id		
  var Url = socket.request.headers.referer;                
  var GetData = Url.split('?id=');   
  var GetDataId = GetData[GetData.length-1] || 'index';       
  var user = '';
  //===============================================

  socket.on('join', function (username) {
    user = username;        
    
    if (!roomUser[GetDataId]) {    
      roomUser[GetDataId] = [];
    }

    roomUser[GetDataId].push(user);
  	socket.join(GetDataId);											
    //新增一個分流 用 Url id 當名稱
    socket.to(GetDataId).emit('UserLogin', user.name + '加入編輯');	
	//UserLogin 是連接口名稱
	//GetDataId 連接口的分流名稱
	//範例解釋:
		//進入順序由上而下
		//User1 連線的Url是 http://localhost:5000/?id=1234
		//User2 連線的Url是 http://localhost:5000/?id=1234
		//User3 連線的Url是 http://localhost:5000/?id=ABCD
			
			// User1 會看到 User2 進入房間 但是不會看到 User3 ，因為to(GetDataId)不同所以分流不同
			// 同理User3不會看到User1 and User2 的狀態

    socket.mayEdit = true;				//Ot 需要將socket.mayEdit 設定為 true
    Ot.setName(socket, user.name);  	//將 socket 的設定資料送給Ot 做執行 ,
  	Ot.addClient(socket);				//將 socket 的設定資料送給Ot 做執行	
  });
  
  //斷開處理
  socket.on('disconnect', function () {
    socket.leave(GetDataId, function (err) {
      if (err) {
          log.error(err);
      } else {
          var index = roomUser[GetDataId].indexOf(user);
          if (index !== -1) {
              roomUser[GetDataId].splice(index, 1);
              socket.to(GetDataId).emit('UserLogin',user.name+'結束編輯');
          	  //原理相同
          } 
      }
    });
  });  
})

//================================================
	//Port設定
HttpClientServer.listen(5000, function (Port) { });
process.on('uncaughtException', function (exc) { });