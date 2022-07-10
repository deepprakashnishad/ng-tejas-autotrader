export class SelectedStock{
    id: string;
    datetime: Date;
    stock: string;
    entryPrice: number;
    quantity: number;
    risk_per_trade: number;
    risk_reward_ratio: number;
    stoploss: number;
    target: number;
    transactionType: string;

    static listToArray(data){
        var mList = []
        data.forEach(result => {
            var temp: SelectedStock = new SelectedStock()
            temp.datetime = result['datetime']
            temp.stock = result['stock']
            temp.id = result['_id']['ObjectId']
            temp.entryPrice = result['entryPrice']
            temp.quantity = result['quantity']
            temp.risk_per_trade = result['risk_per_trade']
            temp.risk_reward_ratio = result['risk_reward_ratio']
            temp.stoploss = result['stoploss']
            temp.target = result['target']
            temp.transactionType = result['transactionType']
            mList.push(temp)
        });

        return mList
    }
}