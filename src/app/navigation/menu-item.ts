export class MenuItem {
  public title: string;
  public parent: MenuItem;
  public icon: string;
  public image: string;
  public separator: boolean;

  /* Allow creation using object or pass in each property individually */
  constructor(private titleOrData: string | {title: string, link?: string, children?: MenuItem[], queryParams?: Object, clickHandler?: Function}, public link: string, public children: MenuItem[] = [], public queryParams: Object = {}, public clickHandler: Function = null) {
    if(!(typeof titleOrData === 'string')) {
      this.title = titleOrData.title;
      this.link = titleOrData.link || null;
      this.children = titleOrData.children || [];
      this.queryParams = titleOrData.queryParams || {};
      this.clickHandler = titleOrData.clickHandler || null;
    } else {
      this.title = titleOrData;
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].parent = this;
    }
  }

  setIcon(icon: string): MenuItem {
    this.icon = icon;
    return this;
  }

  setImage(image: string): MenuItem {
    this.image = image;
    return this;
  }

  setSeparator(value: boolean): MenuItem {
    this.separator = value;
    return this;
  }
}
