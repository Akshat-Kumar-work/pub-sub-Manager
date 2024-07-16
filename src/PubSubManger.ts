import { createClient, RedisClientType } from "redis";


export class PubSubManager{
    private static classInstance :PubSubManager;

    private redisClient:RedisClientType;
    private StockSubscriptions:Map<string,Number[]>;

    private constructor(){
        //create redis client and connect to redis server
        this.redisClient = createClient();
        this.redisClient.connect();

        this.StockSubscriptions = new Map();

    }

    public static getInstance():PubSubManager{
        if(PubSubManager.classInstance){
            return this.classInstance
        }
         this.classInstance = new  PubSubManager();
         return this.classInstance;
    }

    public userSubscribeToStock(userId:Number, stock:string){
        //if stocksubscriptions map does not have this particular stock, set it
        if(!this.StockSubscriptions.has(stock)){
            this.StockSubscriptions.set(stock,[]);
        }
        //if already had stock , than add user 
        this.StockSubscriptions.get(stock)?.push(userId);
        console.log("stock map",this.StockSubscriptions);

        //if the stock is subscribed for first time 
        if(this.StockSubscriptions.get(stock)?.length===1){
            this.redisClient.subscribe(stock ,(message)=>{
                this.forwardMessageToSubscribedUser(stock,message);
            } );
            console.log("subscribes to redis channel",stock);
        }
    }

   public removeUserFromStock(userId:Number,stock:string){
    this.StockSubscriptions.set(stock, this.StockSubscriptions.get(stock)?.filter((user) => user !== userId) || []);

    if (this.StockSubscriptions.get(stock)?.length === 0) {
        this.redisClient.unsubscribe(stock);
        console.log(`UnSubscribed to Redis channel: ${stock}`);
    }
    }

   public forwardMessageToSubscribedUser(stock:string,message:string){

    console.log(`Message received on channel ${stock}: ${message}`);

    // this.StockSubscriptions.get(stock)?.forEach((sub) => {
    //     console.log(`Sending message to user: ${sub}`);
    // });
}
}