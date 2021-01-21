import * as https from "https";
import e from 'express';
import * as fs from "fs";
import { IoContext } from './IoContext';

const privateKey = fs.readFileSync('/etc/letsencrypt/live/kimchistudio.tech/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/kimchistudio.tech/fullchain.pem');
const credentials = { key: privateKey, cert: certificate };
new IoContext(https.createServer(credentials, e()).listen(5000,function(){
	console.log('listening on *:5000');
}));