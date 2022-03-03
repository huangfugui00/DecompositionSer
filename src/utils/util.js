const Utils={
    // 响应客户端 status:1成功,status:0客户端数据有误，status:2服务端有误
    responseClient(res,status=1 ,httpCode = 200, message = '服务端异常', data = {}) {
        let responseData = {};
        responseData.status = status;
        responseData.statusText = message;
        responseData.data = data;
        res.status(httpCode).json(responseData);
    },
}

module.exports=Utils
