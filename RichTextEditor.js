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
