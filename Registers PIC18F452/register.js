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
    let html_bits = this._bit_template({name: 'Name', POBO: 'PO/BO', MCLR: 'MCLR'})
    this.bits.forEach((bit, i) => {
      html_bits += this._bit_template(bit, i);
    });
    return `
    <div class = "register">
      <h1>${this.name}</h1>
      <p>${this.description}</p>
      <div>${html_bits}</div>
    </div>`
  }
}
