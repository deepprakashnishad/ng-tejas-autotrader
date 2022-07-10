import {TechnicalCondition} from './../technical-condition/technical-condition'

export class Strategy{
    _id: string
    name: string
    description: string
    entry_conditions: TechnicalCondition[]
    exit_conditions: TechnicalCondition[]
    symbols: number[]
    stoploss: number
    target: number
    transaction_type: string
    order_type: string
    product: string
    timeframe: number
    compression: number
    max_bet: number
    quantity: number

    constructor(){
        this.name=""
        this.description = ""
        this.entry_conditions = []
        this.exit_conditions = []
        this.symbols = []
        this.stoploss = 2
        this.target = 5
        this.transaction_type = "BUY"
        this.order_type = "MARKET"
        this.product = "MIS"
        this.timeframe = 4
        this.compression = 1
        this.quantity = 1
        this.max_bet = 999999
    }

    getTimeInterval(){
        if(this.timeframe==4 && this.compression==1)
            return "1 Minute"
        if(this.timeframe==4 && [3, 5, 10, 15, 30].indexOf(this.compression)>-1)
            return `${this.compression} Minutes`
        if(this.timeframe==4 && this.compression==60)
            return "1 Hour"
        if(this.timeframe==5 && this.compression==1)
            return "1 Day"
        if(this.timeframe==5 && this.compression==7)
            return "Week"
    }

    setTimeframeCompression(selectedTime){
        if(selectedTime=="1 Minute"){
            this.timeframe = 4
            this.compression = 1
        }else if(selectedTime=="3 Minutes"){
            this.timeframe = 4
            this.compression = 3
        }else if(selectedTime=="5 Minutes"){
            this.timeframe = 4
            this.compression = 5
        }else if(selectedTime=="10 Minutes"){
            this.timeframe = 4
            this.compression = 10
        }else if(selectedTime=="15 Minutes"){
            this.timeframe = 4
            this.compression = 15
        }else if(selectedTime=="30 Minutes"){
            this.timeframe = 4
            this.compression = 30
        }else if(selectedTime=="1 Hour"){
            this.timeframe = 4
            this.compression = 60
        }else if(selectedTime=="1 Day"){
            this.timeframe = 5
            this.compression = 1
        }else if(selectedTime=="Week"){
            this.timeframe = 5
            this.compression = 7
        }
    }

    fromJson(json){
        this._id = json['_id']
        this.name = json['name']
        this.description = json['description']
        this.max_bet = json['max_bet']
        this.order_type = json['order_type']
        this.product = json['product']
        this.quantity = json['quantity']
        this.stoploss = json['stoploss']
        this.symbols = json['symbols']
        this.target = json['target']
        this.timeframe = json['timeframe']
        this.compression = json['compression']
        this.transaction_type = json['transaction_type']

        json['entry_conditions'].forEach(condition => {
            this.entry_conditions.push((new TechnicalCondition()).fromJson(condition))
        });

        json['exit_conditions'].forEach(condition => {
            this.exit_conditions.push((new TechnicalCondition()).fromJson(condition))
        });
    }
}