import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  updateGridData = new EventEmitter();
  updateLastGameData = new EventEmitter();
  constructor() {
  }

  createTheGridData(data) {
    const gridsData = {};
    const gridsLastGameData = {};
    const statCodes = data['statCodes'];
    const statsData = data['data'];
    for (let i = 0, iLen = statsData.length; i < iLen; i++) {
      const statValues = statsData[i].stats;
      const obj = {};
      for (let j = 0, jLen = statCodes.length; j < jLen; j++) {
        obj[statCodes[j]] = statValues[j];
      }
      gridsData[data['topologyIds'][i]] = obj;
      gridsLastGameData[data['topologyIds'][i]] = statsData[i]['lastGameStats'];
    }
    const objToReturn = {'gridData': gridsData, 'lastGameData': gridsLastGameData};
    return objToReturn;
  }

  createTheTableData(statCodes, data, tableTopologyIds, tableNodeMap) {
    const createdData = [];
    for (let i = 0, iLen = data.length; i < iLen; i++) {
      const val = data[i]['stats'];
      const obj = {};
      for (let j = 0, jLen = statCodes.length; j < jLen; j++) {
        obj[statCodes[j]] = val[j];
      }
      obj['tableID'] = tableTopologyIds[i];
      if (!obj['TABLE_NAME']) {
        tableNodeMap.forEach(function (value, key) {
          if (obj['tableID'] === value['nodeId']) {
            obj['TABLE_NAME'] = value['name'];
          }
        });
      }
      createdData.push(obj);
    }
    return createdData;
  }
}
