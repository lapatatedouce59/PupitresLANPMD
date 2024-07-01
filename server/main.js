const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

const {WebSocket, WebSocketServer} = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

const { networkInterfaces } = require('os');
const nets = networkInterfaces();

let CON_STATUS = {
    MOB: 0,
    WEB: 0,
    CON: 0
}

function getAdresses(){
    const results = Object.create(null);
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return results;
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 700,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarOverlay: false,
        icon: path.join(__dirname, '/src/img/icon.png')
    })
    //win.setMenuBarVisibility(false)

    win.loadFile('index.html')
}

app.on('ready',()=> {
    createWindow()
    ipcMain.handle('ping-test', () => {
        return 120;
    })
    ipcMain.handle('localip', () => {
        return getAdresses()
    })
    ipcMain.handle('status', () => {
        return CON_STATUS;
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

/*
    WEBSOCKET
*/

let clients = {}

wss.on('connection', (ws, req) => {
    ws.on('message', msg => {
        msg=JSON.parse(msg)
        console.log(msg)
        if(msg.op===1){
            if(msg.entity==='DASH'){
                CON_STATUS.WEB=1
            }
            if(msg.entity==='MOBI'){
                CON_STATUS.MOB=1
            }
            ws.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            ws.instance = msg.entity
            clients[ws.instance]=ws
        }
        if(msg.op===3){
            if(clients["MOBI"]){
                clients["MOBI"].send(JSON.stringify({ op: 3, value: `${msg.value}` }))
            }
        }
    })
    ws.on("close", ()=>{
        if(clients[ws.instance]){
            delete clients[ws.instance];
            if(ws.instance==='DASH'){
                CON_STATUS.WEB=0
            }
            if(ws.instance==='MOBI'){
                CON_STATUS.MOB=0
            }
        }
    });
})

setInterval(()=>{
    if(CON_STATUS.MOB===1 && CON_STATUS.WEB===1 && CON_STATUS.CON===0){
        CON_STATUS.CON=1
        clients["DASH"].send(JSON.stringify({ op: 2, good: true }))
        clients["MOBI"].send(JSON.stringify({ op: 2, good: true }))
    } else if ((CON_STATUS.MOB===0 || CON_STATUS.WEB===0) && CON_STATUS.CON===1){
        CON_STATUS.CON=0
        for(let CLIENTS of Object.entries(clients)){
            CLIENTS[1].send(JSON.stringify({ op: 2, good: false }))
        }
    }
},100)