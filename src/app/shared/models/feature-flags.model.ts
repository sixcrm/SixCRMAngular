export class FeatureFlags {

  obj: any;
  flags: FeatureFlag[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.obj = obj;

    this.flags = this.createFlags();
  }

  public isEnabled(featurePath: string) {
    return this.enabled(featurePath.split('.'), this.obj.features);
  }

  private createFlags() {
    let flags: FeatureFlag[] = [];
    let objFeatures = this.obj.features;

    for (let flag in objFeatures) {
      flags.push(new FeatureFlag(flag, objFeatures[flag].name, objFeatures[flag].description, objFeatures[flag].default, objFeatures[flag].features));
    }

    return flags
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

export class FeatureFlag {
  public id: string;
  public name: string;
  public description: string;
  public isDefault: boolean;
  public flags: FeatureFlag[];

  constructor(id: string, name: string, description: string, isDefault: boolean, flags: any) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isDefault = isDefault;
    this.flags = [];

    if (flags) {
      for (let flag in flags) {
        this.flags.push(new FeatureFlag(flag, flags[flag].name, flags[flag].description, flags[flag].default, flags[flag].features));
      }
    }
  }

  public get default() {
    return this.isDefault;
  }
}
