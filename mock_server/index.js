const fs = require('fs');
const WebSocketServer = require('ws');

const wss = new WebSocketServer.Server({ port: 3210 })
 
// Creating connection using websocket
wss.on("connection", ws => {
    console.log("new client connected");
    let rawData = fs.readFileSync('sample_data.json');
    let parsedData = JSON.parse(rawData);
    let users = parsedData.users

    // every 3 seconds we want to send one of the sample users
    // to the client. This makes testing easier. Adjust the 
    // interval value or remove it if needed
    let i = 0;
    setInterval(() => {
        if (i < users.length){
            ws.send(JSON.stringify(users[i]))
            i++
        }
        else {
            clearInterval()
        }
    }, 3000);

    // sending message
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 3210");