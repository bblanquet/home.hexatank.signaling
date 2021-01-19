import { IoContext } from './IoContext';
import e from 'express';
import * as http from "http";

const app: e.Application = e();
const httpServer = http.createServer(app);
const ioContext = new IoContext(httpServer);
httpServer.listen(5000,()=>{console.log("listen 5000")});
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});