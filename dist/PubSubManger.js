"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubManager = void 0;
const redis_1 = require("redis");
class PubSubManager {
    constructor() {
        //create redis client and connect to redis server
        this.redisClient = (0, redis_1.createClient)();
        this.redisClient.connect();
        this.StockSubscriptions = new Map();
    }
    static getInstance() {
        if (PubSubManager.classInstance) {
            return this.classInstance;
        }
        this.classInstance = new PubSubManager();
        return this.classInstance;
    }
    userSubscribeToStock(userId, stock) {
        var _a, _b;
        //if stocksubscriptions map does not have this particular stock, set it
        if (!this.StockSubscriptions.has(stock)) {
            this.StockSubscriptions.set(stock, []);
        }
        //if already had stock , than add user 
        (_a = this.StockSubscriptions.get(stock)) === null || _a === void 0 ? void 0 : _a.push(userId);
        console.log("stock map", this.StockSubscriptions);
        //if the stock is subscribed for first time 
        if (((_b = this.StockSubscriptions.get(stock)) === null || _b === void 0 ? void 0 : _b.length) === 1) {
            this.redisClient.subscribe(stock, (message) => {
                this.forwardMessageToSubscribedUser(stock, message);
            });
            console.log("subscribes to redis channel", stock);
        }
    }
    removeUserFromStock(userId, stock) {
        var _a, _b;
        this.StockSubscriptions.set(stock, ((_a = this.StockSubscriptions.get(stock)) === null || _a === void 0 ? void 0 : _a.filter((user) => user !== userId)) || []);
        if (((_b = this.StockSubscriptions.get(stock)) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            this.redisClient.unsubscribe(stock);
            console.log(`UnSubscribed to Redis channel: ${stock}`);
        }
    }
    forwardMessageToSubscribedUser(stock, message) {
        console.log(`Message received on channel ${stock}: ${message}`);
        // this.StockSubscriptions.get(stock)?.forEach((sub) => {
        //     console.log(`Sending message to user: ${sub}`);
        // });
    }
}
exports.PubSubManager = PubSubManager;
