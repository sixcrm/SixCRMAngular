export class Weight {

  unitofmeasurement: string;
  units: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.unitofmeasurement = obj.unitofmeasurement;
    this.units = obj.units;

  }

  copy(): Weight {
    return new Weight(this.inverse())
  }

  inverse(): any {
    return {
      unitofmeasurement: this.unitofmeasurement,
      units: this.units
    }
  }
}
