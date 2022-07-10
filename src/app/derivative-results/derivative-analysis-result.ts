export class DerivativeAnalysisResult{
    datetime: string
    stock: string;
    delivery_change: number;
    close: number;
    high: number;
    low: number;
    open: number;
    coi_change: number;
    delivery: number;
    avg_del: number;
    vwap: number;
    oi_combined: number;
    price_change: number;
    position: string;
    pcr: number;
    pcr_of_changed_oi: number;
    net_pe: number;
    net_ce: number;
    net_pe_change: number;
    net_ce_change: number;
    net_pe_change_pct: number;
    net_ce_change_pct: number;
    max_pain_ce: any;
    max_pain_pe: any;
    priority: number;
    pivot_points: any;
    cpr_width: any;

    static listToArray(data){
        var darList = []
        data.forEach(result => {
            var dar: DerivativeAnalysisResult = new DerivativeAnalysisResult()
            dar.datetime = result['datetime']
            dar.stock = result['stock']
            dar.delivery_change = result['delivery_change']
            dar.close = result['close']
            dar.high = result['high']
            dar.low = result['low']
            dar.open = result['open']
            dar.coi_change = result['coi_change']
            dar.delivery = result['delivery']
            dar.avg_del = result['5_day_avg_del']
            dar.vwap = result['vwap']
            dar.oi_combined = result['oi_combined']
            dar.price_change = result['price_change']
            dar['position'] = result['position']
            dar['pcr'] = result['pcr']
            dar['pcr_of_changed_oi'] = result['pcr_of_change']
            dar['net_ce'] = result['net_ce']
            dar['net_pe'] = result['net_pe']
            dar['net_ce_change'] = result['net_ce_change']
            dar['net_pe_change'] = result['net_pe_change']
            dar['net_ce_change_pct'] = result['net_ce_change_pct']
            dar['net_pe_change_pct'] = result['net_pe_change_pct']
            dar['max_pain_ce'] = result['max_pain_ce']  
            dar['max_pain_pe'] = result['max_pain_pe']
            dar['priority'] = result['priority']
            dar['pivot_points'] = result['pivot_points']
            dar['cpr_width'] = result['cpr_width']
            darList.push(dar)
        });

        return darList
    }
}