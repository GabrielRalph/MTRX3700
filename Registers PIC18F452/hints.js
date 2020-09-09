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
