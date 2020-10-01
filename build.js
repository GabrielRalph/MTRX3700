
// RICH TEXT EDITOR ------------------------------------------------------------------------
// Rich Text Editor
class RTEditor{
  constructor(el, tools = {}, par_separator = 'p') {
    this.eventCallbackParams = {
      'onchange': 'value'
    }
    this.tools = {
      '<b>b</b>': 'bold',
      '<i>i</i>': 'italic',
      '⇢': 'indent',
      '⇠': 'outdent',
    }
    this.tools = Object.assign(this.tools, tools);
    if (typeof el === 'string'){
      this.el = document.getElementById(el);
    }else{
      this.el = el;
    }

    //Create text document
    this.oDoc = document.createElement('div')
    this.oDoc.setAttribute('class', 'doc');

    //Create tool box
    this.tool_box = document.createElement('div');
    this.tool_box.setAttribute('class', 'tool-box');

    //Create tools
    for(var name in this.tools){
      //Create tool el
      let tool = document.createElement('DIV');
      let toolCmd = this.tools[name];
      tool.innerHTML = name;
      //Attach listener
      tool.addEventListener('click', () => {
        this.formatDoc(toolCmd)
      })
      this.tool_box.appendChild(tool)
    }

    //Add tool box and text document
    this.el.appendChild(this.oDoc);
    this.el.appendChild(this.tool_box);

    this.setupDoc(par_separator);

    this.observer = new MutationObserver(() => {
      this.runEventListeners('change')
    })
    this.observer.observe(this.oDoc, {characterDataOldValue: true, subtree: false, childList: true,})
    this._focus = false;
    this.oDoc.addEventListener('focusout',() => {
      this.runEventListeners('change')
      this._focus = false;
    })
    this.oDoc.addEventListener('focusin',() => {
      this._focus = true;
    })
    let shift_tab = false
    this.oDoc.addEventListener('keydown',(e) => {
      if (e.key === 'Tab'){
        e.preventDefault();
        if (shift_tab){
          this.formatDoc('outdent')
        }else{
          this.formatDoc('indent')
        }
      }else if(e.key === 'Shift'){
        shift_tab = true;
      }
      this.runEventListeners('change')
    })
    this.oDoc.addEventListener('keyup',(e) => {
      shift_tab = false
    })
  }

  set onchange(val){
    if (val instanceof Function){
      this._onchange = [val];
    }else{
      throw new TypeError('onchange can only be set to a function');
    }
  }
  get onchange(){
    if (this._onchange){
      return this._onchange;
    }else{
      this._onchange = [];
      return [];
    }
  }
  addEventListener(name, callback){
    if (this[`on${name}`]){
      if (callback instanceof Function){
        this[`_on${name}`].push(callback);
      }else{
        throw new TypeError('Event listeners must be functions');
      }
    }else{
      throw `${name} is not a valid event`
    }
  }
  runEventListeners(name){
    if (this[`on${name}`]){
      let e = this[`on${name}`];
      e.forEach((callback) => {
        if (this.eventCallbackParams[`on${name}`]){
          let paramKey = this.eventCallbackParams[`on${name}`];
          callback(this[paramKey]);
        }else{
          callback()
        }
      });
    }else{
      throw `${name} is not a valid event`
    }
  }

  formatDoc(sCmd, sValue) {
    this.oDoc.focus();
    document.execCommand(sCmd, false, sValue);
  }

  setupDoc(sep) {
    let oContent = document.createRange();
    oContent.selectNodeContents(this.oDoc);
    this.oDoc.innerHTML = oContent.toString();
    document.execCommand('defaultParagraphSeparator', false, sep)
    this.oDoc.contentEditable = true;
    this.oDoc.focus();
  }

  get isFocus(){
    return this._focus;
  }

  get value() {
    return this.oDoc.innerHTML;
  }
  set value(val){
    // if (!this.isFocus){
      this.oDoc.innerHTML = val;
    // }
  }
}
Vue.component('texteditor', {
  props: ['value', 'value_set'],
  template: `<div ref = "main_el" class = "editor-box"></div>`,
  data: function(){
    return {
      editor: null,
    }
  },
  mounted(){
    this.editor = new RTEditor(this.$refs['main_el']);
    this.editor.value = this.value
    this.editor.onchange = () => {
      this.$emit('input', this.editor.value);
    }
    this.editor.value = this.value;
  },
  watch: {
    value_set: function(newVal, oldVal){
      console.log(newVal);
      this.editor.value = newVal;
    }
  }
})


// REGISTER VUE COMPONENTS ------------------------------------------------------------------------
//Gets registers from a firebase realtime database with the ref = /registers
Vue.component('fire-registers', {
  template: `<div><register v-if = "registers.length > 0" v-for = "reg in registers" :value = "reg" :key = "reg.name + 'block'" @click = "showHints"></register></div>`,
  props: {
    filter: {
      type: String,
      default: ''
    }
  },
  data: function(){
    return {
      registers_list: [],
      hints: new Hints('hints'),
      click_count: 0,
      last_click: null,
    }
  },
  created(){
    firebase.database().ref('/registers').on('value', (sc) => {
      let regs = sc.val();
      this.registers = [];
      for (var key in regs){
        this.registers.push(regs[key])
      }
      this.$emit('loaded')
    })
  },
  methods: {
    showHints: function(e){
      if (e.i == null){
        if(this.click_count == 0){
          this.click_count++;
          this.last_click = e.name;
          setTimeout(() => {
            console.log(this.click_count);
            if(this.click_count > 3){
              firebase.database().ref(`/registers/${this.last_click}`).remove()
            }
            this.click_count = 0;
          }, 700);
        }else if(e.name == this.last_click){
          this.click_count++;
        }else{
          this.click_count = 0;
        }
      }
      this.hints.show = {body: e.description, head: e.name}
    }
  },
  computed: {
    registers: function(){

      if (this.filter.length > 0){
        let filter = new SmartFilter(this.filter)
        let fd_obj = {};

        this.registers_list.forEach((register) => {

          let frq = filter.appears_in_register(register);
          if (frq > 0){
            while( frq in fd_obj){frq ++}
            fd_obj[frq] = register
          }
        });
        let res = [];
        for (var key in fd_obj){
          res.unshift(fd_obj[key])
        }
        return res
      }else{
        return this.registers_list;
      }
    }
  }
})

class SmartFilter{
  constructor(filter){
    this.filter = filter;
    this.scale = 30;
  }
  set filter(val){
    if (typeof val === 'string' && val.length > 0){
      this._filter = val.toLowerCase()
    }else{
      this._filter = ''
      throw `Invalid filter`
    }
  }
  get filter(){
    return this._filter
  }

  _scale_rank (x){
    if (typeof x == 'number'){
      return Math.pow(this.scale, x)
    }else{
      return 1
    }
  }

  appears(s, scaler = 0){
    if (typeof s !== 'string' || s.length == 0){return 0}

    scaler = typeof scaler !== 'number' ? 0 : scaler;

    s = s.toLowerCase();

    // See if the filter appears in the given string as is and scale it by 10 if it does;
    let res = this._frequency(this.filter, s) * this._scale_rank(1 + scaler);
    //Split filter up and check individual elements
    let f = this.filter.replace(',', '').split(' ');
    f.forEach((subf) => {
      if (subf.length && subf.length > 2){
        res += this._frequency(subf, s) * this._scale_rank(scaler);
      }
    });
  return res
  }

  appears_in_register(reg){
    let res = 0;
    res += this.appears(reg.name, 3);
    res += this.appears(reg.description, 2);
    reg.bits.forEach((bit) => {
      res += this.appears(bit.name, 1);
      res += this.appears(bit.description);
    });
    return res
  }

  _frequency(f, s){
    if (typeof f == 'string' && typeof s == 'string' && s.length > 0 && f.length > 0){
      let re = new RegExp(f, 'g');
      return (s.match(re) || []).length
    }else{
      return 0
    }
  }
}

/*
Register takes prop
value = {
  name: String,             \ required
  description: String,      \ required
  bits: [                   \ required
    {
      MCLR Reset: String,   \ default '0'
      PO/BO Reset: String,  \ default MCLR
      name: String,         \ default null
      description: String,  \ default null
      rw: Number            \ default 'r/w'
    }
  ]
}
*/
Vue.component('register', {
  props: ['value'],
  template: `
  <div class = 'register'>
    <register-bit :value = "value" :key = "value.name" @click = "handleClick"></register-bit>
    <register-bit v-for = "(bit, i) in value.bits" :value = "bit" :key = "bit.name + i" :indice = "i" @click = "handleClick"></register-bit>
  </div>`,
  data: function(){
    return {
    }
  },
  methods: {
    handleClick: function(e){
      this.$emit('click', e)
    }
  }
})
//Single bit template + event handling
Vue.component('register-bit', {
  props: {
    value: Object,
    indice: {
      type: Number,
      default: null,
    }
  },
  template: `
  <div @click = "clickHandler" :class = "{highlight: value.description.length > 0}">
    <h2 v-if = "indice !== null">{{7 - indice}}</h2>
    <h4>{{value.rw}}</h4>
    <div>
      <h3>{{value.name?value.name:(indice == null?'NAME':'-')}}</h3>
      <h3>{{value.POBO?value.POBO:(indice == null?'PO/BO':'-')}}</h3>
      <h3>{{value.MCLR?value.MCLR:(indice == null?'MCLR':'-')}}</h3>
    </div>
  </div>
  `,
  methods: {
    clickHandler: function(){
      this.$emit('click', Object.assign({i: this.indice}, this.value))
    }
  },
})

// MISC. OBJECTS ------------------------------------------------------------------------
//Cute wave path | no scalling x [0, 2PI] y [1, -1]
// toString returns svg d path
class WavePath{
  constructor(dt = 0.1){
    this.offset = 0;
    this.dt = dt;
  }
  set offset(o){
    this._offset = o;
  }
  get offset(){
    return this._offset;
  }
  toString(){
    let d = ''
    for (var t = 0; t < 2*Math.PI; t+=this.dt){
      d += `L${Math.round(t*10000)/10000},${Math.round(Math.sin(this.offset + t)*10000)/10000}`
    }
    d = `M${d.slice(1)}`;
    return d
  }
}
Vue.component('wave-loader', {
  template: `
  <div v-if = "loading" class = "wave-load">
    <svg viewBox = '-0.5 -1.5 7.28 3' width = "20vw">
      <path stroke-linecap = "round" stroke-width = '0.1' stroke = 'white' fill = 'none' :d = "animation_path"></path>
    </svg>
  </div>`,
  props: ['loading'],
  methods: {
    start: function(){
      let wave = new WavePath();
      let next = (time) => {
        if (this.loading){
          wave.offset = time/300;
          this.animation_path = `${wave}`
          window.requestAnimationFrame(next);
        }
      }
      window.requestAnimationFrame(next);
    }
  },
  data: function(){
    return {
      animation_path: 'M0,0',
    }
  },
  watch: {
    loading: function(){
      if (this.loading){
        this.start()
      }
    }
  },
  mounted(){
    if (this.loading){
      this.start()
    }
  }
})

// HINTS OBJECTS ------------------------------------------------------------------------
/* Hints - cute package that emerges from bottom of screen to show hints
    construct with an element ID as parameter.
    set show = {head: head_content. body: body_content}
*/
class Hints{
  constructor(id){
    this.el = document.getElementById(id);
    this.hints = [];
    this.el.ondblclick = () => {
      this.show = false;
    }
  }
  set show(hint){
    let i = 0;
    if (typeof hint == 'object' && 'head' in hint && 'body' in hint && typeof hint.head == 'string' && typeof hint.body == 'string' && hint.body.length > 0){
      if (!(this.hints.length > 0 && this.hints[this.hints.length - 1].content.body == hint.body)){
        let hint_a = new Hint(this);
        this.hints.push(hint_a);
        hint_a.content = hint;
        hint_a.smoothShow();
        i = 1;
      }
    }

    while (this.hints.length > i){
      let hint_b = this.hints.shift();
      console.log(hint_b);
      hint_b.smoothHide(() => {
        hint_b.destroy();
      })
    }
  }

  get show(){
    return this._show
  }
}

class Hint{
  constructor(hints){
    this.hints = hints;
    this.el = document.createElement('DIV');
    this.pos = 0;
    this.hints.el.appendChild(this.el);

    this.ANIMATION_TIME = 400;
  }


  _animate(bool, callback = null){
    if (typeof bool !== 'boolean'){
      throw 'Error setting hidden:\nhidden must be set to a boolean value\n'
    }else{
      let start_time = null
      let next_frame = (time) => {
        start_time = start_time === null ? time : start_time;
        let x = Math.PI * (time - start_time)/this.ANIMATION_TIME;
        let y = 50 * (Math.cos(x) + 1);

        y = bool ? 100 - y: y;

        if (x < Math.PI){
          this.pos = y;
          window.requestAnimationFrame(next_frame);
        }else{
          this.pos = bool ? 100 : 0;
          if (callback instanceof Function){
            callback();
          }else if (callback != null){
            throw `Error calling smoothShow:\nCallback must be a Function.\n`
          }
        }
      }
      window.requestAnimationFrame(next_frame);

    }
  }

  smoothShow(callback = null){
    this._animate(true, callback);
  }
  smoothHide(callback = null){
    this._animate(false, callback);
  }

  //Set the contents of the hint
  //{
  //  body: String,
  //  head: String
  //}
  set content(val){
    if (typeof val == 'object' && 'head' in val && 'body' in val && typeof val.head == 'string' && typeof val.body == 'string'){
      this.el.innerHTML = `<h1>${val.head}</h1><p>${val.body}</p>`;
      this._content = {head: val.head, body: val.body};
    }else{
      throw `Error setting content: content must be set to an object with format\n{\nbody: String,\nhead: String\n}\n`
    }
  }
  get content(){
    if (this._content){
      return this._content;
    }else{
      return null
    }
  }

  //Set the position of the hint
  //0: hidden
  // ...
  //100: completely shown
  set pos(d){
    if (typeof d === 'number' && d >=0 && d <= 100 ){
      this.el.style.setProperty('transform', `translate(0, ${100 - d}%)`)
      this._pos = d;
    }else if (typeof d === 'string'){
      this.pos = parseFloat(d);
    }else{
      throw `Error setting pos: pos must be set to a number between 0 and 100 (inclusive)\nStrings accepted\n`
    }
  }
  get pos(){
    return this._pos;
  }

  destroy(){
    this.hints.el.removeChild(this.el)
  }
}

// cool_inputs -----------------------------------------------------------------------------
Vue.component('cool-input', {
  template: `

  <div style = "position: relative; display: inline">
    <svg v-if = "type == 'search'" :stroke = "text_color" :style = "'cursor: pointer; transform: translate(-50%, -50%); position: absolute; top: 50%; left: '+icon_offset+'; fill: none; width: 1em; height: 1em'" viewBox = "0 0 10 10">
      <path d = "M5.62,5.62L9,9" stroke-linecap = "round"></path>
      <ellipse cx = "3.5" cy = "3.5" rx = "3" ry = "3"></ellipse>
    </svg>
    <svg @click = "clear" :stroke = "text_color" :style = "'cursor: pointer; transform: translate(50%, -50%); position: absolute; top: 50%; right: '+icon_offset+'; fill: none; width: 1em; height: 1em'" viewBox = "0 0 10 10">
      <path d = "M2,2L8,8M2,8L8,2" stroke-linecap = "round"></path>
    </svg>
    <input :style = "'padding-left: calc('+icon_offset+' * 1.5);padding-right: calc('+icon_offset+' * 1.5)'" ref = "input_el" :value = "value" @input = "on_input" :type = "input_type"/>
  <div />
  `,

  props: ['value', 'type'], // type: number, text, search
  data: function(){
    return {
      text_color: `white`,
      icon_offset: '0.8em',
    }
  },
  methods: {
    on_input: function (e){
      this.$emit('input', e.target.value);
    },
    clear: function(){
      this.$emit('input', '')
    }
  },
  computed: {
    input_type: function(){
      return this.type == 'search' ? 'text' : this.type;
    }
  },
  mounted(){
    let container = this.$refs.input_el;
    window.onresize = () => {
      this.icon_offset = container.clientHeight/2 + 'px';
    }
    setTimeout(() => {
      window.onresize()
    }, 1)
  }
})

// Number formater ------------------------------------------------------------------------
class DecBinHex{
  constructor(el = null){
    if (el != null) this.addTool(el)

    this.bin_regex = new RegExp('(0b|B)(0|1)*');
    this.hex_regex = new RegExp('(0x|X)([0-9]|[A-F]|[a-f])*');

    this.p = 8;

    this.v_tag = 'h3'
  }

  set dec(dec){
    if (typeof dec === 'number' && Math.round(dec) == dec){
      this._dec = dec;
    }else if (typeof dec === 'string' && `${parseInt(dec)}` === dec){
      this.dec = parseInt(dec);
    }else{
      throw 'Error setting dec:\n dec must be set to an integer as a number or string'
    }
  }
  get dec(){
    return this._dec ? this._dec : 0;
  }

  set bin(val){
    if (typeof val !== 'string' || val.length == 0){
      throw 'Error setting bin:\nbin must be set to a valid string'
      return
    }

    let bin = (val.match(this.bin_regex) || []);
    if (bin.length == 0 || bin[0] != val){
      throw `Error setting bin:\n${val} is an invalid bin string format`
      return
    }

    bin = bin[0].replace('0b', '').replace('B', '')
    let res = 0;
    for (var i = 0; i < bin.length; i++){
      res += parseInt(bin[bin.length - 1 - i]) << i;
    }
    this.dec = res;
  }
  get bin(){
    let res = '';
    let i = 0;
    let dec = this.dec;
    while((dec != 0 && dec != -1) || (i % this.p != 0)){
      res = `${dec & 1}` + res;
      dec = dec >> 1;
      i++;
    }
    return `0b${res}`
  }

  set hex(val){
    if (typeof val !== 'string' || val.length == 0){
      throw 'Error setting hex:\nhex must be set to a valid string'
      return
    }
    val = val.toLowerCase()

    let hex = (val.match(this.hex_regex) || []);
    if (hex.length == 0 || hex[0] != val){
      throw `Error setting hex:\n${val} is an invalid hex string format`
      return
    }
    hex = hex[0].replace('0x', '').replace('X', '')
    let res = 0;
    let key = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15}
    for (var i = 0; i < hex.length; i++){
      res += key[hex[hex.length - 1 - i]] << i*4;
    }
    this.dec = res;
  }
  get hex(){
    let res = ''
    let i = 0;
    let dec = this.dec;
    while ((dec != 0 && dec != -1) || (i % (this.p/4) != 0)){
      let hex = dec & 15;
      res = (hex < 10 ? `${hex}` : String.fromCharCode(87 + hex)) + res;
      dec = dec >> 4;
      i++;
    }
    return `0x${res}`
  }

  get values(){
    return {dec: this.dec, bin: this.bin, hex: this.hex}
  }
  get value_html(){
    return `<${this.v_tag}>Dec: ${this.dec}</${this.v_tag}>
            <${this.v_tag}>Bin: ${this.bin}</${this.v_tag}>
            <${this.v_tag}>Hex: ${this.hex}</${this.v_tag}>`
  }
  set value(val){
    try {
      this.hex = val;
    } catch(e){
      try {
        this.bin = val;
      } catch(e){
        try {
          this.dec = val;
        }catch (e){
          throw `Error setting value:\n${val} is an invalid value`
        }
      }
    }
  }

  addTool(id){
    this.el = document.getElementById(id);

    this.input = document.createElement('INPUT');
    this.el.appendChild(this.input);
    this.input.setAttribute('spellcheck', false);

    this.result_box = document.createElement('DIV');
    this.el.appendChild(this.result_box);

    this.input.oninput = () => {
      if (this.input.value.length == 0){
        this.result_box.innerHTML = '';
        this.input.style.borderColor = '#f6ffab';
        this.result_box.style.borderColor = '#f6ffab';
        return
      }
      try {
        this.value = this.input.value;
      } catch(e){
        this.input.style.borderColor = '#e83b3b';
        this.result_box.style.borderColor = '#e83b3b';
        return
      }
      this.input.style.borderColor = '#57ca57';
      this.result_box.style.borderColor = '#57ca57';
      this.result_box.innerHTML = this.value_html;
    }
  }
}
