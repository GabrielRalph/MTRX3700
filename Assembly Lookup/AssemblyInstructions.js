class SmartKeys{
  constructor(keys){
    this.keys = keys;
  }

  forEach(visit){
    if (!(visit instanceof Function)) {
      throw new TypeError('Error calling forEach:\nforEach expects a Function as its first parameter', 'keys.js',visit)
      return
    }
    let recurse = (obj, path = []) => {
      if (typeof obj === 'string'){
        visit(path[path.length - 1], obj, path);
      }else if (typeof obj === 'object'){
        for (var key in obj){
          recurse(obj[key], path.concat([key]))
        }
      }
    }
    recurse(this.keys)
  }

  find(key){
    let found = false
    this.forEach((name, info, path) => {
      if (key === name){
        found = {cat: path[0], info: info}
      }
    });
    return found
  }

  replaceKeys(str, replace){
    this.forEach((key, val) => {
      key = key.replace(/(\*|\+|\!|\|)/g, (a) => {
        return `\\${a}`
      })
      let reg = new RegExp(`([(]| |^)(${key})(?!([A-Z]|[a-z]|\\*))`, 'g');
      str = str.replace(reg, (a,b,c) => {
        if (replace instanceof Function){
          return replace(c)
        }else if(typeof replace === 'string'){
          return b + replace.replace(/\$&/g, c)
        }
      })
    });
    return str
  }
}
class SmartItns{
  constructor(itns){
    this.itns = itns;
  }

  delete(path){
    delete this.itns[path[0]][path[1]]
    console.log(this.itns);
  }

  forEach(visit){
    if (!(visit instanceof Function)) {
      throw new TypeError('Error calling forEach:\nforEach expects a Function as its first parameter', 'keys.js',visit)
      return
    }
    let recurse = (obj, path = []) => {
      if (typeof obj === 'object'){
        if (obj.Hex && obj.Function && obj.Description && obj.Mnemonic){
          visit(obj, path);
        }else{
          for (var key in obj){
            recurse(obj[key], path.concat([key]))
          }
        }
      }
    }
    recurse(this.itns)
  }

  get array(){
    let return_array = []
    this.forEach((name, itn, path) => {
      return_array.push(Object.assign({name:name,path:path}, itn))
    });
    return return_array
  }
}
