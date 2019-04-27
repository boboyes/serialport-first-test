var express = require("express");
var bodyParser = require("body-parser");
var port_s = 8088;
var SerialPort = require('serialport');  //导入串口模块
var port_c = new SerialPort('COM2');  //实例化串口
var port_c2 = new SerialPort('COM1');  //实例化串口
var app = express();

// create application/json parser
var jsonParser = bodyParser.json()

// 创建 application/x-www-form-urlencoded 编码解析
//var urlencodedParser = bodyParser.urlencoded({ extended: false })
// var querystring = require("querystring");
var router = express.Router();
let data1 = 0;  //定义一个全局变量。初次尝试，这个方法有点low
let data2 = 0;  //定义一个全局变量。初次尝试，这个方法有点low
router.get("/", function(req, res, next) {
  req.url = "/index.html";
  next();
});
app.use(router);

// 2、路由
var routes = express.Router();
//3、编写接口
routes.post("/goods", jsonParser, (req, res) => {
  //console.log(req.body.hello);
  data1 = req.body.hello;
  writeport(data1);
  res.json(data2);
});
app.use("/api", routes);

//定义static目录，指向./dist目录
app.use(express.static("./dist"));

// 启动express
module.express = app.listen(port_s, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("http://localhost:" + port_s + "\n");
});

port_c.on('open', function () {  //监听串口是否开启
    console.log('COM已经连接！')
});

port_c.on('error', function (err) {  //错误处理
    console.log('Error: ', err.message);
})

port_c.on('data', function (data) {  //串口数据接收
    data2 = chuli(data);
    console.log('recv: ' + data2);
});
function chuli(data){ //串口数据处理函数
    let distance = data.toString("ascii").substr(6, 2).toString('hex');
    let Ndis = parseInt(distance,16)
    return Ndis;
}

function writeport(sendData) {
  port_c2.write(sendData, function(err) {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
    console.log("send: " + sendData);
  });
}