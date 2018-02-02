export class Measure {

  unitofmeasurement: string;
  units: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.unitofmeasurement = obj.unitofmeasurement;
    this.units = obj.units;

  }

  copy(): Measure {
    return new Measure(this.inverse())
  }

  inverse(): any {
    return {
      unitofmeasurement: this.unitofmeasurement,
      units: this.units
    }
  }
}
