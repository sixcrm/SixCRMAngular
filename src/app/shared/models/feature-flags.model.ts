export class FeatureFlags {

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.obj = obj;
  }

  public isEnabled(featurePath: string) {
    return this.enabled(featurePath.split('.'), this.obj.features);
  }

  private enabled(flags: string[], features: any) {
    if (!features) {
      return false
    }

    let flag: string = flags[0];
    let feature = features[flag];


    if (!feature.enabled && !feature.default) {
      return false;
    }

    if (flags.length === 1) {
      return feature.enabled || feature.default;
    }

    return this.enabled(flags.slice(1), feature.features);

  }

}
