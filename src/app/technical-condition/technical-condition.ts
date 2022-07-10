import {Technical} from '../technical/technical'
import { TechnicalOperator } from '../technical-operator/technical-operator'

export class TechnicalCondition{
    technical1: Technical
    operator: TechnicalOperator
    technical2: Technical
    timeframe: number
    compression: number
    symbols: string[]

    constructor(){
        this.technical1 = new Technical()
        this.technical2 = new Technical()
        this.operator = new TechnicalOperator()
    }
    
    fromJson(json){
        this.operator = json['operator']
        this.technical1 = (new Technical()).fromJson(json['technical1'])
        this.technical2 = (new Technical()).fromJson(json['technical2'])

        return this
    }
}