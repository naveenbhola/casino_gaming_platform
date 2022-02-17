export class WDTSUtility {
  static routeBack(currentUrl: string, currentRoute: string): string {
    let backRoute = '';
    let intermittentUrl = '';
    let accessToken = '';
    if (currentUrl.indexOf('?') > -1) {
      intermittentUrl = currentUrl.split('?')[0];
      accessToken = currentUrl[1];
    }
    else {
      intermittentUrl = currentUrl;
    }
    if (intermittentUrl.indexOf(currentRoute) > -1) {
      backRoute = intermittentUrl.substr(0, intermittentUrl.lastIndexOf('/'));
      if (accessToken !== '') {
        backRoute = backRoute + accessToken;
      }
    }
    return backRoute;
  }

  /* The function checks if the array elements are consecutive
     If elements are consecutive, then returns true,
     else returns false */
  static areConsecutive(arr: Array<number>, n: number): boolean {
    if (n < 1) {
      return false;
    }

    /* 1) Get the minimum element in array */
    const min = this.getMin(arr, n);

    /* 2) Get the maximum element in array */
    const max = this.getMax(arr, n);

    /* 3) max - min + 1 is equal to n,  then only check all elements */
    if (max - min + 1 === n) {
      /* All values are initialized  as false */
      const visited = new Array(false, false, false);
      let i;
      for (i = 0; i < n; i++) {
        /* If we see an element again, then return false */
        if (visited[arr[i] - min] !== false) {
          return false;
        }

        /* If visited first time, then mark the element as visited */
        visited[arr[i] - min] = true;
      }

      /* If all elements occur once, then return true */
      return true;
    }
    return false; // if (max - min  + 1 != n)
  }

  /* UTILITY FUNCTIONS */
  static getMin(arr: Array<number>, n: number): number {
    let min = arr[0];
    for (let i = 1; i < n; i++) {
      if (arr[i] < min) {
        min = arr[i];
      }
    }
    return min;
  }

  static getMax(arr: Array<number>, n: number): number {
    let max = arr[0];
    for (let i = 1; i < n; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  }

  static maxDiff(arr: Array<number>, arr_size: number): number {
    let max_diff = arr[1] - arr[0];
    let i, j;
    for (i = 0; i < arr_size; i++) {
      for (j = i + 1; j < arr_size; j++) {
        if (arr[j] - arr[i] > max_diff) {
          max_diff = arr[j] - arr[i];
        }
      }
    }
    return max_diff;
  }

  static equalIgnoreCase(string1, string2, ignoreCase, useLocale) {
    if (ignoreCase) {
      if (useLocale) {
        string1 = string1.toLocaleLowerCase();
        string2 = string2.toLocaleLowerCase();
      }
      else {
        string1 = string1.toLowerCase();
        string2 = string2.toLowerCase();
      }
    }
    return string1 === string2;
  }

  static validateNumberField(_event, maxLength, value) {
    let valLen;
    if (_event) {
      if (_event.currentTarget) {
        valLen = _event.currentTarget.value.length;
      } else if (_event.target) {
        valLen = _event.target.value.length;
      }
    } else {
      valLen = value.length;
    }

    return ( valLen < maxLength && _event.charCode >= 48 && _event.charCode <= 57 );
  }

  static isNonZeroRegex(evt, maxlen) {
    let isNonZeroValue = false;
    if (evt.length <= maxlen && /^\d+$/.test(evt)) {
      const regEx = /^0+$/
      isNonZeroValue = regEx.test(evt);
    }
    return isNonZeroValue;
  }


  static openTableDash(jwtData, decodedJwt, protocol, webServerDNS, tableObj, tableUIPort, webCasinoManagerTLSPort, tableUIProtocol, _snackBar, _translate, isPermitted) {
    if ( decodedJwt.applications.includes('TABLE_DASH') && isPermitted) {
      const casinoMngrUrl = protocol + webServerDNS + ':' + webCasinoManagerTLSPort;
      const tableDashboardURL = tableUIProtocol + tableObj.host + ':' + tableUIPort + '/single-table-view?access_token=' +
        jwtData + '&externalRedirection=' + casinoMngrUrl + '/#/overview&topologyId=' + tableObj.nodeId;
      window.open(tableDashboardURL);
    } else {
      _snackBar.open(_translate.instant
      ('application.app.common.labels.NO_ACCESS_TO_REQUESTED_PAGE'), '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__warn'
      });
    }
  }

  static dateDiffInDays(date1, date2) {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(),
      dt1.getMonth(), dt1.getDate()) ) / (1000 * 60 * 60 * 24));
  }

  static compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  /**
   * Determine if a value is empty or not
   * @param val the value to check
   */
  static isEmpty(val: any): boolean {
    if (val === undefined || val == null) {
      return true;
    }
    if (typeof val === 'string') {
      return val.trim().length <= 0;
    }
    if (typeof val === 'number') {
      return val <= 0;
    }
    return ('' + val).trim().length === 0;
  }

}
