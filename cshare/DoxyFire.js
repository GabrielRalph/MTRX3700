const firebaseConfig = {
  apiKey: "AIzaSyDniS0prRjEmOyKbMd4jequo9gkwe2otKI",
  authDomain: "fashion-galetora.firebaseapp.com",
  databaseURL: "https://fashion-galetora.firebaseio.com",
  projectId: "fashion-galetora",
  storageBucket: "fashion-galetora.appspot.com",
  messagingSenderId: "469438762797",
  appId: "1:469438762797:web:759f543ce82183b9f04da4",
  measurementId: "G-Q7DJ37H3D0"
};
firebase.initializeApp(firebaseConfig);


class DoxyFire extends SvgPlus{
  build(){
    this.getFiles();
    this.props = {class: 'doxy-fire'}
  }
  async getFiles(){
    this.innerHTML = '';
    let sn = await firebase.database().ref('cshare/').once('value');
    let files = sn.val();
    for (var name in files){
      let revs = files[name];
      name = name.replace('_', '.');

      let rev_name = Object.keys(revs)
      console.log(rev_name);

      rev_name = rev_name[rev_name.length - 1];
      console.log(rev_name);

      let doxygen = new Doxygen('div');
      doxygen.code = revs[rev_name]
      doxygen.header = name;
      this.appendChild(doxygen)
      console.log(name);
    }
  }

  async readFile(file){
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) return;
      var reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      }
      reader.readAsText(file);
      setTimeout(() => {reject(null)}, 10000);
    })
  }

  async addFiles(fileList){
    if (!(fileList instanceof FileList)) return;
    for (var i = 0; i < fileList.length; i++){
      console.log(fileList[i]);
      let res = await this.addFile(fileList[i]);
      if (res == null) console.log(fileList[i].filename + ' was not uploaded');
    }
  }

  async addFile(file){
    if (!(file instanceof File)) return null;

    let text = await this.readFile(file);
    if (text == null) return null;
    console.log(text);

    var filename = file.name.replace('.', '_');
    let pushkey = await firebase.database().ref('/cshare/'+filename).push();
    return pushkey.set(text);
  }
}
