export class Instrument{
    _id: string
    exchange: string
    instrument_token: string
    instrument_type: string
    lot_size: number
    segment: string
    tradingsymbol: string

    static getInstrumentTokenList(instruments: Array<Instrument>){
        let instrumentTokenList: Array<any> = []
        instruments.forEach(instrument => {
            instrumentTokenList.push(instrument.instrument_token)
        });

        return instrumentTokenList
    }

    static getListFromJson(jsonInstruments){
        let instruments = []
        for(let i=0; i<jsonInstruments.length;i++){
            let json = jsonInstruments[i]
            let instrument = new Instrument()
            instrument._id = json['_id']['ObjectId']
            instrument.exchange = json['exchange']
            instrument.instrument_token = json['instrument_token']
            instrument.instrument_type = json['instrument_type']
            instrument.lot_size = json['lot_size']
            instrument.segment = json['segment']
            instrument.tradingsymbol = json['tradingsymbol']

            instruments.push(instrument)
        }

        return instruments
    }
}