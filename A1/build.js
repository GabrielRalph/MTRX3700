class StateWave{
  constructor(svg, y_pos){
    this.parent = svg;
    this.el = this.parent.createChild('path', {fill: 'none', stroke: 'black', 'stroke-width': '0.1'});
    this.el.M(new Vector(0, y_pos));
    this.state = false;
  }

  high(){
    if (this.state){
      this.same();
    }else{
      this.el.l(new Vector(0, -1)).l(new Vector(1, 0));
    }
    this.state = true;
  }

  low(){
    if (this.state){
      this.el.l(new Vector(0, 1)).l(new Vector(1, 0));
    }else{
      this.same()
    }
    this.state = false;
  }
  same(){
    this.el.l(new Vector(1, 0))
  }
}

class States{
  constructor(svg){
    this.el = svg;
    this.channels = {};
    this.labels = {};
    this._p_count = 0;
    this.c_count = 0;
    this.p_count = 0;
  }

  set c_count(val){
    this.el.props = {viewBox: `-3 -1 ${this.p_count + 3} ${val*2 + 2}`};
    this._c_count = val;
  }
  get c_count(){return this._c_count}
  set p_count(val){
    this.el.props = { viewBox: `-3 -1 ${val + 3} ${this.c_count*2 + 2}`};
    this._p_count = val;
  }
  get p_count(){return this._p_count}

  addChannel(name){
    this.channels[name] = new StateWave(this.el, this.c_count*2 + 1);
    this.labels[name] = this.el.createChild('text', {x: -3, y: `${this.c_count*2 + 1}`, 'font-size': '0.8'})
    this.labels[name].innerHTML = name;
    this.c_count++;
  }
  removeChannel(name){
    if (name in this.channels){
      delete this.channels[name];
    }
  }

  high(name){
    for (var name_i in this.channels){
      if (name_i == name){
        this.channels[name].high();
      }else{
        this.channels[name_i].same();
      }
    }
    this.p_count ++;

  }
  low(name){
    for (var name_i in this.channels){
      if (name_i == name){
        this.channels[name].low();
      }else{
        this.channels[name_i].same();
      }
    }
    this.p_count ++;
  }

  same(){
    for (var name_i in this.channels){
      this.channels[name_i].same();
    }
    this.p_count ++;
  }
}
