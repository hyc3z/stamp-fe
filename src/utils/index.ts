/**
 * Created by hao.cheng on 2017/4/28.
 */

import { RangePickerValue } from "antd/lib/date-picker/interface";
import moment from 'moment'
// 获取url的参数
export const queryString = () => {
    let _queryString: { [key: string]: any } = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

export function getCurrentTimeStamp(): string {
   return (new Date().valueOf() / 1000).toString()
}

export function parseRangePickerValue(dates: RangePickerValue): [string, string] {
    const startTimestamp = ((dates[0] as moment.Moment)?.valueOf() / 1000).toString() ?? "0"
    const endTimestamp = ((dates[1] as moment.Moment)?.valueOf() / 1000).toString() ?? (new Date().valueOf() / 1000).toString()
    return [startTimestamp, endTimestamp]
}