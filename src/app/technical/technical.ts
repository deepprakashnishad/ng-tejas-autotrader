export class Technical{
    _id: string
    name: string
    description: string
    tech_args: any

    constructor(){        
        this.name = ""
        this.description = ""
        this.tech_args = {}
    }

    fromJson(json){
        this.name = json['name']
        this.description = json['description']
        this.tech_args = json['tech_args']

        return this
    }
}