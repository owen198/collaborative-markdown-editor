var ServeStaticLibrary = require('serve-static');        
var ExpressLibrary = require('express');                 
var PathLibrary = require('path');                       
var HttpLibrary = require('http');                       

var OtLibrary = require('ot');                           
var SocketIoLibrary = require('socket.io');              

var ExpressClient = ExpressLibrary();                           
var HttpClientServer = HttpLibrary.createServer(ExpressClient);

var CodeValue = 
"# (GitHub-Flavored) Markdown Editor\n" +
"\n" +
"Basic useful feature list:\n" +
"\n" +
" * Ctrl+S / Cmd+S to save the file\n" +
" * Ctrl+Shift+S / Cmd+Shift+S to choose to save as Markdown or HTML\n" +
" * Drag and drop a file into here to load it\n" +
" * File contents are saved in the URL so you can share files\n" +
"\n" +
"\n" +
"I'm no good at writing sample / filler text, so go write something yourself.\n" +
"\n" +
"Look, a list!\n" +
"\n" +
" * foo\n" +
" * bar\n" +
" * baz\n" +
"\n" +
"And here's some code! :+1:\n" +
"\n" +
"```javascript\n" +
"$(function(){\n" +
"  $('div').html('I am a div.');\n" +
"});\n" +
"```\n" +
"\n" +
"This is [on GitHub](https://github.com/jbt/markdown-editor) so let me know if I've b0rked it somewhere.\n" +
"\n" +
"Props to Mr. Doob and his [code editor](http://mrdoob.com/projects/code-editor/), from which\n" +
"the inspiration to this, and some handy implementation hints, came.\n" +
"\n" +
"### Stuff used to make this:\n" +
"\n" +
" * [markdown-it](https://github.com/markdown-it/markdown-it) for Markdown parsing\n" +
" * [CodeMirror](http://codemirror.net/) for the awesome syntax-highlighted editor\n" +
" * [highlight.js](http://softwaremaniacs.org/soft/highlight/en/) for syntax highlighting in output code blocks\n" +
" * [js-deflate](https://github.com/dankogai/js-deflate) for gzipping of data to make it fit in URLs\n";

//=====================================================
ExpressClient.use('/', ServeStaticLibrary(PathLibrary.join(__dirname, '/')));
ExpressClient.use('/', ServeStaticLibrary(PathLibrary.join(__dirname, '/')));
//=====================================================
var SocketoIoListen = SocketIoLibrary.listen(HttpClientServer);
var SocketIoServer = 
  new OtLibrary.EditorSocketIOServer(
    CodeValue, 
    [], 
    'Text', 
    function(socket, ClientData){
      ClientData(!!socket.mayEdit);
    }
  );


//=====================================================
SocketoIoListen.on('connection', function (socket){
  SocketIoServer.addClient(socket);
  socket.on('UserLogin', function (data){
    socket.mayEdit = true;
    SocketIoServer.setName(socket, data.name);
    
    if(socket.emit("UserLoginData", {})){
      console.log("OK");
    }else{
      console.log("Error");
    }
  })
})


//================================================
HttpClientServer.listen(3000, function (Port) { });
process.on('uncaughtException', function (exc) { });