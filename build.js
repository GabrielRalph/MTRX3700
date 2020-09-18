
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
    if (!this.isFocus){
      this.oDoc.innerHTML = val;
    }
  }
}
Vue.component('texteditor', {
  props: ['value'],
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
    this.editor.innerHTML = this.value;
  }
})


// REGISTER VUE COMPONENTS ------------------------------------------------------------------------
//Gets registers from a firebase realtime database with the ref = /registers
Vue.component('fire-registers', {
  template: `<div><register v-if = "registers.length > 0" v-for = "reg in registers" :value = "reg" :key = "reg.name + 'block'" @click = "showHints"></register></div>`,
  data: function(){
    return {
      registers: [],
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
  }
})
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
      xbits: [0, 3, 6, 9]
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
    if (typeof hint == 'object' && 'head' in hint && 'body' in hint && typeof hint.head == 'string' && typeof hint.body == 'string'){
      let hint_a = new Hint(this);
      this.hints.push(hint_a);
      hint_a.content = hint;
      hint_a.smoothShow();
      i = 1;
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
