export class EventFunnel {
  click: EventStatisticsResult;
  lead: EventStatisticsResult;
  main: EventStatisticsResult;
  upsell: EventStatisticsResult;
  confirm: EventStatisticsResult;

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    let values = {
      click: {},
      lead: {},
      main: {},
      upsell: {},
      confirm: {}
    };

    for (let array of obj) {
      for (let element of array) {
        if (element.key === 'name') {
          array.forEach(e => values[element.value][e.key] = e.value);
        }
      }
    }

    this.click = new EventStatisticsResult(values.click);
    this.lead = new EventStatisticsResult(values.lead);
    this.main = new EventStatisticsResult(values.main);
    this.upsell = new EventStatisticsResult(values.upsell);
    this.confirm = new EventStatisticsResult(values.confirm);
  }
}

export class EventStatisticsResult {
  count: number;
  percentage: number;
  relativePercentage: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.count = obj.count;
    this.percentage = obj.percentage;
    this.relativePercentage = obj.relative_percentage;
  }
}
