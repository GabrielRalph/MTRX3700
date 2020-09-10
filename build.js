
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
        console.log(regs[key]);
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
            if(this.click_count > 2){
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
  <div @click = "clickHandler">
    <h2 v-if = "indice !== null">{{indice}}</h2>
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
  }
  set show(hint){
    if (this.show === hint || (this.show && this.show.body === hint.body)){
      hint = false;
    }
    this._show = hint;
    let hint_window = null;
    let height1 = 0;
    if (hint !== false){
      hint_window = document.createElement('DIV')
      if (hint.body){
        hint_window.innerHTML = `<h1>${hint.head}</h1><p>${hint.body}</p>`
      }else if (typeof hint === 'string'){
        hint_window.innerHTML = hint
      }
      hint_window.onclick = () => {this.show = false}
      this.el.appendChild(hint_window);
      height1 = parseInt(hint_window.clientHeight);
    }
    let height0 = parseInt(this.el.children[0].clientHeight) +10;
    let bottom0 = parseInt(this.el.children[0].style.bottom);
    let bottom1 = -height1;
    let dec = 10;
    let frame = () => {
      if (hint_window !== null){
        hint_window.style.setProperty('bottom', `${bottom1}px`)
      }
      if(this.el.children.length > 1 || hint === false){
        this.el.children[0].style.setProperty('bottom', `${bottom0}px`)
      }
      if (bottom1 < -10 || bottom0 > -height0){
        bottom1 += bottom1 < 0?dec:0;
        bottom0 -= bottom0 > -height0?dec:0;
        dec *= 0.98;
        window.requestAnimationFrame(frame)
      }else{
        while (this.el.children.length > 1){
          this.el.removeChild(this.el.firstChild)
        }
      }
    }
    window.requestAnimationFrame(frame)
  }
  get show(){
    return this._show
  }
}
