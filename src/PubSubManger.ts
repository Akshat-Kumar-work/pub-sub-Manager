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
        if(!this.StockSubscriptions.has(stock)){
            this.StockSubscriptions.set(stock,[]);
        }
        this.StockSubscriptions.get(stock)?.push(userId);

        if(this.StockSubscriptions.get(stock)?.length===1){
            this.redisClient.subscribe(stock ,(message)=>{
             
            } )
        }
    }

    removeUserFromStock(userId:Number,stock:string){

    }

    forwardMessageToUser(userId:string,stockTicker:string,price:string){
        
    }
}