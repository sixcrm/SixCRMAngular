export class EventFunnel {
  click: EventStatisticsResult;
  lead: EventStatisticsResult;
  main: EventStatisticsResult;
  upsell: EventStatisticsResult;
  confirm: EventStatisticsResult;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.click = new EventStatisticsResult(obj.click);
    this.lead = new EventStatisticsResult(obj.lead);
    this.main = new EventStatisticsResult(obj.main);
    this.upsell = new EventStatisticsResult(obj.upsell);
    this.confirm = new EventStatisticsResult(obj.confirm);
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
