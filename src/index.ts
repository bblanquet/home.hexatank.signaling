import * as http from "http";
import e from 'express';
import { IoContext } from './IoContext';
const port = process.env.PORT || 5000;
new IoContext(http.createServer(e()).listen(port,function(){
	console.log(`starting to listen on *:${port}`);
}));