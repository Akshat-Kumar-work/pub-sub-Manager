"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PubSubManger_1 = require("./PubSubManger");
PubSubManger_1.PubSubManager.getInstance().userSubscribeToStock(Math.random(), "ORDER");
