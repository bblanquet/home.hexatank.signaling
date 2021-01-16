import { IoContext } from './IoContext';
import { RoomManager } from './RoomManager';
import e from 'express';
import * as http from "http";

const app: e.Application = e();
const httpServer = http.createServer(app);
const ioContext = new IoContext(httpServer);
var roomManager = new RoomManager();

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
