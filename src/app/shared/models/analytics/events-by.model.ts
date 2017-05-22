export class EventsByFacets {
  facet: string;
  count: number;
  percentage: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.facet = obj.facet || '';
    this.count = obj.count ? Number(obj.count) : 0;
    this.percentage = obj.percentage || '-';
  }
}

export class EventsBy {
  count: number;
  facetType: string;
  facets: EventsByFacets[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.count = obj.count || 0;
    this.facetType = obj.facetType || '';

    if (obj.facets || obj.facets.length > 0) {
      obj.facets.forEach(facet => this.facets.push(new EventsByFacets(facet)));
    }
  }
}
