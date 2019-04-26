var http = require('http');
var SerialPort = require('serialport');
var port = new SerialPort('COM2');
let data2 = 0;

var server = http.createServer(function (request, response) {
    //处理请求和响应
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'key': 'value'
    });
    //往响应体中放数据(只能是字符串)
    response.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="1">
    <title>hello</title>
</head>
<script src="jquery.min.js"></script>
<body>
    <div id="show">${data2}CM</div>
</body>
<script>
    setInterval(() => {
      $("#show").load("http://localhost:8080")
    }, 3000);
</script>

</html>
    `);
    response.end();
});
//启动服务
server.listen(8080, function (error) {
    console.log('成功监听8080端口');

});

port.on('open', function () {
    console.log('COM已经连接！')
});

port.on('error', function (err) {
    console.log('Error: ', err.message);
})

port.on('data', function (data) {

    data2 = chuli(data);
    console.log('recv: ' + data2);
});
function chuli(data){
    let distance = data.toString("ascii").substr(6, 2).toString('hex');
    let Ndis = parseInt(distance,16)
    return Ndis;
}