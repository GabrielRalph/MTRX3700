/*
Register can be constructed using with an object parameter
info = {
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
class Register{
  constructor(info = null){
    if (info != null){
      this.byte = info;
    }
    this.bits = [];
  }

  set byte(info){
    this.name = info.name;
    this.description = info.description;
    this.bits = [];
    info.bits.forEach((bit) => {
      let bit_to_push = {
        MCLR: bit.MCLR?bit.MCLR:'0',
        name: bit.name?bit.name:null,
        description: bit.description?bit.description:null,
        rw: bit.rw?bit.rw:'r/w',
      }
      if (bit.POBO){
        bit_to_push['POBO'] = bit.POBO;
      }else{
        bit_to_push['POBO'] = bit_to_push.MCLR;
      }
      this.bits.push(bit_to_push)
    });
  }

  _bit_template(bit, i = null){
    return `
    <div onclick = 'registerHints.show = {head: "${bit.name==null?'-':bit.name}", body: "${bit.description}"}'>
      ${i===null?'':`<h2>${i}</h2>`}
      <div>
        <h3>${bit.name===null?'-':bit.name}</h3>
        <h3>${bit.POBO}</h3>
        <h3>${bit.MCLR}</h3>
      </div>
    </div>
    `
  }

  toString(){
    let html_bits = this._bit_template({name: this.name, description: this.description, POBO: 'PO/BO', MCLR: 'MCLR'})
    this.bits.forEach((bit, i) => {
      html_bits += this._bit_template(bit, i);
    });
    return `
    <div class = "register">
      <div class = "bits-box">${html_bits}</div>
    </div>`
  }
}

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
