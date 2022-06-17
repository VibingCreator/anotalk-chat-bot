import WebSocket from "ws";

const payloads = {
    initTeenMW: [
        "initChat",
        {
            "gender":"man",
            "partner_gender":"woman",
            "ages":"1",
            "counties":{
                "POL3141":true,"POL3143":true,"POL3142":true,"POL3145":true,"POL3144":true,"POL3140":true,
                "POL3139":true,"POL3150":true,"POL3151":true,"POL3147":true,"POL3149":true,"POL3148":true,
                "POL3152":true,"POL3146":true,"POL3167":true,"POL3170":true
            }
        }
    ],
    initAdultMW: [
        "initChat",
        {
            "gender":"man",
            "partner_gender":"woman",
            "ages":"2",
            "counties":{
                "POL3141":true,"POL3143":true,"POL3142":true,"POL3145":true,"POL3144":true,"POL3140":true,
                "POL3139":true,"POL3150":true,"POL3151":true,"POL3147":true,"POL3149":true,"POL3148":true,
                "POL3152":true,"POL3146":true,"POL3167":true,"POL3170":true
            }
        }
    ],
    initAdultPlusMW: [
        "initChat",
        {
            "gender":"man",
            "partner_gender":"woman",
            "ages":"3",
            "counties":{
                "POL3141":true,"POL3143":true,"POL3142":true,"POL3145":true,"POL3144":true,"POL3140":true,
                "POL3139":true,"POL3150":true,"POL3151":true,"POL3147":true,"POL3149":true,"POL3148":true,
                "POL3152":true,"POL3146":true,"POL3167":true,"POL3170":true
            }
        }
    ],
    initTeenWM: [
        "initChat",
        {
            "gender":"woman",
            "partner_gender":"man",
            "ages":"1",
            "counties":{
                "POL3141":true,"POL3143":true,"POL3142":true,"POL3145":true,"POL3144":true,"POL3140":true,
                "POL3139":true,"POL3150":true,"POL3151":true,"POL3147":true,"POL3149":true,"POL3148":true,
                "POL3152":true,"POL3146":true,"POL3167":true,"POL3170":true
            }
        }
    ],
    initAdultWM: [
        "initChat",
        {
            "gender":"woman",
            "partner_gender":"man",
            "ages":"2",
            "counties":{
                "POL3141":true,"POL3143":true,"POL3142":true,"POL3145":true,"POL3144":true,"POL3140":true,
                "POL3139":true,"POL3150":true,"POL3151":true,"POL3147":true,"POL3149":true,"POL3148":true,
                "POL3152":true,"POL3146":true,"POL3167":true,"POL3170":true
            }
        }
    ],
    initAdultPlusWM: [
        "initChat",
        {
            "gender":"woman",
            "partner_gender":"man",
            "ages":"3",
            "counties":{
                "POL3141":true,"POL3143":true,"POL3142":true,"POL3145":true,"POL3144":true,"POL3140":true,
                "POL3139":true,"POL3150":true,"POL3151":true,"POL3147":true,"POL3149":true,"POL3148":true,
                "POL3152":true,"POL3146":true,"POL3167":true,"POL3170":true
            }
        }
    ],
    leave: ["leaveChat", {}],
    look: ["lookForPartner", {}],
    say: ["sendMessage", {"message": "hello world" }],
    greet: ["onChatStart", {}],
    ping: "2",
    pong: "3"
};

class Connect {
    constructor(endpoint, pingInterval, target) {
        this.endpoint = endpoint;
        this.pingInterval = pingInterval;
        this.target = target;
        this.isAlive = false;
        this.sequence = 0;
        this.init();
    }

    init = () => {
        this.ws = new WebSocket(this.endpoint);
        this.ws.on("open", this.open);
        this.ws.on("message", this.message);
        this.ws.on("close", this.close);
    }
    
    ping = () => {
        if (this.isAlive) {
            this.ws.send(payloads.ping);
            setTimeout(this.ping, this.pingInterval);
        }
    }

    open = () => {
        this.isAlive = true;
        this.ws.send(`42${JSON.stringify(this.target)}`);
        setTimeout(this.ping, this.pingInterval);
    };

    message = (data) => {        
        const plainData = data.toString();

        if (this.sequence > 1 && plainData !== payloads.pong) {
            const parsed = JSON.parse(plainData.slice(2));

            console.log(parsed);
            
            switch(parsed[0]) {
                case "onChatStart": {
                    setTimeout(() => {
                        this.ws.send(`42${JSON.stringify(payloads.say)}`);
                    }, 500);
                    
                    break;
                }

                case "onMessage": {
                    setTimeout(() => {
                        this.ws.send(`42${JSON.stringify(payloads.leave)}`);
                    }, 500);

                    break;
                }

                case "onChatEnd": {
                    setTimeout(() => {
                        this.ws.send(`42${JSON.stringify(payloads.look)}`);
                    }, 500);

                    break;
                }
            }
        }

        this.sequence += 1;
    }

    close = (code, reason) => {
        this.isAlive = false;
        console.log("close", code, reason);
        setTimeout(this.init, 5000);
    };
}


new Connect("wss://atplsrv.anotalk.hu/socket.io/?EIO=3&transport=websocket", 25000, payloads.initTeenMW);
new Connect("wss://atplsrv.anotalk.hu/socket.io/?EIO=3&transport=websocket", 25000, payloads.initAdultMW);
new Connect("wss://atplsrv.anotalk.hu/socket.io/?EIO=3&transport=websocket", 25000, payloads.initAdultPlusMW);