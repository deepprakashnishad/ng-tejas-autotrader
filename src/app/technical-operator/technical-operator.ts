export class TechnicalOperator{
    _id: string
    name: string
    description: string
    is_unary: boolean
    tech_args: any
  
    constructor(){        
        this.name = ""
        this.description = ""
        this.is_unary = false
        this.tech_args = {}
    }
  
    fromJson(json){
        this.name = json['name']
        this.description = json['description']
        this.tech_args = json['tech_args']
        this.is_unary = json['is_unary']
        return this
    }
}