const WebSocket = require("ws");
const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const openaiTalk = require("../openaiTalk.js");


const aiCharacters = [openaiTalk.createCharacter()]
console.log(aiCharacters[0].name)

let characters = ["lgbt支持者","特朗普支持者","原神爱好者（米卫兵）","爱坤一族","资深废萌二次元狂热者",
"圆梦之心吹","迷你世界吹"]

let connections = []
function getRandomElement() {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
}

let db = new sqlite3.Database("aiShaDatabase.db", err => {
    if (err) {
        return console.error(err.message);
    }
});

function updateMsgData()
{
 
    let sql = `SELECT * FROM aiShaInfo;`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        connections.forEach(connection => {
            connection.send("update_web:"+JSON.stringify(rows))
        });
       
        
    });
}

function talk()
{

}

function createServer(httpServer) {
    const server = new WebSocket.Server({ server: httpServer });
    const router = express.Router();

    server.on("connection",  connection => {
        connection.on("message", async message => {
            console.log("收到信息"+message)
            message = message.toString("utf-8");
            if(message.startsWith("对话："))
            {
                let data = message.substring("对话：".length)
                data = JSON.parse(data)
                db.run(`INSERT INTO aiShaInfo(name,content) VALUES(?,?)`, data.name, data.content, function (err) {
                    if (err) {
                        return console.error(err.message);
                    }
                });
                updateMsgData(connection)

                openaiTalk.addHistory(aiCharacters,`${data.name}：${data.content}`);
                const results = await openaiTalk.talk(aiCharacters);
                console.log(results)
                results.forEach(result => {
                    db.run(`INSERT INTO aiShaInfo(name,content) VALUES(?,?)`,result.name, result.content, function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                    });
                    if(result.content.indexOf("<做出选择>")!=-1)
                    {
                        connection.send("win")
                        for(let i =0 ;i<connections.length;i++)
                        {
                            if(connections[i]==connection)
                            {

                            }else
                            {
                                connections[i].send("lose")
                            }
                         
                        }
                    }
                });
                updateMsgData()
            }
            else if(message === "new_character")
            {
                connections.push(connection)
                connection.send("set_character:"+getRandomElement())

            }else if(message == "update_message")
            {
                updateMsgData()

            }else if(message == "init")
            {
                db.run(`DELETE FROM aiShaInfo`, function (err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log(`数据已经重置！`);
                });
               
                    updateMsgData()
              
            }

 
        });
        connection.on("close", () => {
            console.log("WebSocket连接已关闭");
        });
    });

    let app = express();
    // WebSocket升级中间件
    app.use(function (req, res, next) {
        if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === "websocket") {
            server.handleUpgrade(req, req.socket, Buffer.alloc(0), function done(ws) {
                server.emit("connection", ws, req);
            });
        } else {
            next();
        }
    });


    //serialize用于确保数据库操作（如执行SQL语句）按照顺序执行。
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS  aiShaInfo (name TEXT,content TEXT)");
    });

    return router;
}

module.exports.createServer = createServer;