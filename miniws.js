/* RFC6455 WebSocket server fallback for offline demos. Prefer the audited `ws` package in production.
   Supports: text messages, fragmented text, ping/pong/close, server heartbeats, payload limits.
   No browser client code is required: browsers use their native WebSocket implementation. */
import {EventEmitter} from 'node:events';
import crypto from 'node:crypto';
export class WebSocket {
 static CONNECTING=0;static OPEN=1;static CLOSING=2;static CLOSED=3;
 constructor(socket,maxPayload=4096){this.socket=socket;this.maxPayload=maxPayload;this.readyState=1;this.inbuf=Buffer.alloc(0);this.fragments=[];this.fragmentBytes=0;this.isAlive=true;this.events=new EventEmitter();
  socket.on('data',chunk=>this.receive(chunk));socket.on('close',()=>{this.readyState=3;this.events.emit('close');});socket.on('error',error=>this.events.emit('error',error));}
 get bufferedAmount(){return this.socket.writableLength||0;}
 on(type,callback){this.events.on(type,callback);return this;}
 frame(op,bytes=Buffer.alloc(0)){
  if(this.readyState!==1 && op!==8)return;
  const data=Buffer.isBuffer(bytes)?bytes:Buffer.from(String(bytes));const head=Buffer.alloc(data.length<126?2:data.length<=65535?4:10);head[0]=0x80|op;
  if(head.length===2){head[1]=data.length;}else if(head.length===4){head[1]=126;head.writeUInt16BE(data.length,2);}else{head[1]=127;head.writeBigUInt64BE(BigInt(data.length),2);}
  try{this.socket.write(Buffer.concat([head,data]));}catch{}
 }
 send(message){this.frame(1,Buffer.from(message));}
 ping(){this.frame(9);}
 close(code=1000,reason=''){if(this.readyState!==1)return;const reasonBytes=Buffer.from(String(reason).slice(0,110));const b=Buffer.alloc(2+reasonBytes.length);b.writeUInt16BE(code,0);reasonBytes.copy(b,2);this.frame(8,b);this.readyState=2;this.socket.end();}
 terminate(){this.readyState=3;this.socket.destroy();}
 protocolFail(){this.close(1002,'Protocol error');this.socket.destroySoon?.();}
 receive(chunk){if(this.readyState!==1)return;this.inbuf=Buffer.concat([this.inbuf,chunk]);if(this.inbuf.length>this.maxPayload*3+100){this.close(1009,'Too large');return;}
 while(this.inbuf.length>=2){const b0=this.inbuf[0],b1=this.inbuf[1],opcode=b0&0x0f,fin=!!(b0&0x80),masked=!!(b1&0x80);
  if((b0&0x70)!==0 || !masked || ![0,1,8,9,10].includes(opcode)){this.protocolFail();return;}
  let length=b1&127,offset=2;
  if(length===126){if(this.inbuf.length<4)return;length=this.inbuf.readUInt16BE(2);offset=4;}
  if(length===127){if(this.inbuf.length<10)return;const big=this.inbuf.readBigUInt64BE(2);if(big>BigInt(this.maxPayload)){this.close(1009,'Too large');return;}length=Number(big);offset=10;}
  if(length>this.maxPayload || this.fragmentBytes+length>this.maxPayload){this.close(1009,'Too large');return;}
  if(opcode>=8 && (!fin || length>125)){this.protocolFail();return;}
  if(this.inbuf.length<offset+4+length)return;
  const key=this.inbuf.subarray(offset,offset+4),data=Buffer.from(this.inbuf.subarray(offset+4,offset+4+length));this.inbuf=this.inbuf.subarray(offset+4+length);
  for(let i=0;i<data.length;i++)data[i]^=key[i%4];
  if(opcode===8){this.close(1000,'Closing');return;}
  if(opcode===9){this.frame(10,data);continue;}
  if(opcode===10){this.events.emit('pong');continue;}
  if(opcode===1){if(this.fragments.length){this.protocolFail();return;}if(fin)this.events.emit('message',data);else{this.fragments=[data];this.fragmentBytes=data.length;}continue;}
  if(opcode===0){if(!this.fragments.length){this.protocolFail();return;}this.fragments.push(data);this.fragmentBytes+=data.length;if(fin){const joined=Buffer.concat(this.fragments);this.fragments=[];this.fragmentBytes=0;this.events.emit('message',joined);}continue;}
 }
 }
}
export class WebSocketServer extends EventEmitter {
 constructor({server,path='/ws',maxPayload=4096}={}){super();this.clients=new Set();this.path=path;this.maxPayload=maxPayload;
  server.on('upgrade',(request,socket,head)=>{
   const pathname=new URL(request.url,'http://localhost').pathname;
   if(pathname!==this.path){socket.destroy();return;}
   const key=request.headers['sec-websocket-key'],version=request.headers['sec-websocket-version'];
   if(typeof key!=='string'||!/^[-+/A-Za-z0-9]{22}==$/.test(key)||version!=='13'){socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');socket.destroy();return;}
   const accept=crypto.createHash('sha1').update(key+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
   socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+accept+'\r\n\r\n');
   const ws=new WebSocket(socket,this.maxPayload);this.clients.add(ws);ws.on('close',()=>this.clients.delete(ws));this.emit('connection',ws,request);
   if(head?.length)ws.receive(head);
  });
 }
}