export class StringUtils {
  public static isEmpty(str: string): boolean {
    return StringUtils.isNull(str) || str === '';
  }

  public static isNull(obj: any): boolean {
    return obj === undefined || obj === null;
  }

  public static isNumeric(str: any): boolean {
    if(this.isEmpty(str)) {
      return false;
    }
    return !isNaN(str - parseFloat(str)); // From jQuery (https://github.com/jquery/jquery/blob/25d8ccd1112d75394b91071ff7eba13283aaf898/src/core.js#L223)
  }

  public static replaceBetween(str: string, replaceWith: string, start: number, end: number): string {
    return str.substring(0, start) + replaceWith + str.substring(end);
  }

  public static cleanLinkString(linkStr: string) {
    return linkStr ? linkStr.includes("?") ? linkStr.split("?")[0] : linkStr : linkStr;
  }

  // http://stackoverflow.com/questions/1068834/object-comparison-in-javascript/1144249#1144249
  public static deepCompare(x, y): boolean {
    let p, leftChain = [], rightChain = [];

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if(isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if(x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if(!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if(x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if(x.constructor !== y.constructor) {
      return false;
    }

    if(x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if(leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if(y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      }
      else if(typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if(y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      }
      else if(typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof (x[p])) {
        case 'object':
        case 'function':

          leftChain.push(x);
          rightChain.push(y);

          if(!StringUtils.deepCompare(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if(x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }
    return true;
  }
}
