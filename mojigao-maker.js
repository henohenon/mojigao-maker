const JikkouButton = document.getElementById('jikkou');
const UrlInput= document.getElementById('url-input');
const resultDivided = document.getElementById('result-area');
const TextInput = document.getElementById("input-text");
const HozonButton = document.getElementById("hozon");
const tokoButton = document.getElementById("toko");
const canvas = document.getElementById('board');

const himawariButton = document.getElementById("himawari");


var sosyokuNum=0;//装飾(防止とか)の番号
var haikeNum=0;//背景の番号
var karadaNum=0;//体の番号
var oldText="";//古い入力された単語(？)
var mojigaoURL="";//文字顔のURL
var kaoBoshiURL="";//文字顔のURL




/***
const mojipos=[
  [
    [0, -20],
    [120, -20],
    [0, -80],
    [120, -80],
    [80, -50],
    [-20,130]
  ]
];
***/
//文字の場所。
//パターンがいくつか(2)の中にそれぞれの文字の場所(3)(の中のx座標とy座標(4))
const mojipos =
[
  [
    [-50, -150],
    [70, -150],
    [-140,40]
  ],
  [
    [-100, -220],
    [30, -220],
    [60, -60],
    [-60,130]
  ],
  [
    [-20, -10],
    [100, -10],
    [-20, -70],
    [100, -70],
    [-60,110]
  ],
  [
    [-40, -20],
    [100, -20],
    [-20, -80],
    [100, -80],
    [60, -50],
    [-60,130]
  ]
];
//パターンがいくつか(2)の中にそれぞれの文字のサイズ(3)(の中のxのサイズとyのサイズ(4))
const mojisize=
[
  [
    [400,300],
    [400,300],
    [800,200]
  ],
  [
    [500,375],
    [500,375],
    [240,260],
    [600,120]
  ],
  [
    [320,110],
    [320,110],
    [300,225],
    [300,225],
    [600,120]
  ],
  [
    [320,110],
    [320,110],
    [300,224.10],
    [300,224.10],
    [240,260],
    [600,120]
  ]
];
const koteipos={
  "顔のみ-顔":[0,0]
}
const koteisize={
  "顔のみ-顔":[300,300]
}
const sosyoku_URLs={
  "麦わら帽子":"./images/sosyoku/麦わら帽子"
}
const karada_URLs={
  "ひまわり":"./images/karada/ひまわり"
}
const haike_URLs={
  "ひまわり畑":"./images/haike/ひまわり畑"
}





HozonButton.onclick = () => {
  //let text=TextInput.value;
  let link = document.createElement('a');
  link.href = mojigaoURL;//URLCanvas();

  link.download = text+'.png';
  /***
  if(text!==""){
  }else{
    link.download = text+'.png';
  }
  ***/
  link.click();
}
tokoButton.onclick = () => {
  //let text=TextInput.value;
  let canvas = document.querySelector("#board");
  UrlInput.value = canvas.toDataURL();//URLCanvas();
}

himawariButton.onclick=()=>{
  sosyokuNum=1;

}

//todo。。。入力が空白なら押せないようにする。
JikkouButton.onclick = () => {
  let text=TextInput.value;//入力された単語(?)
  
  //image配列
  let images = new Array();
  //作ったキャンバスを何に入れるか。変数を渡したいんだけど、値渡しになっちゃうから配列
  let canvasSet=new Array();
  //画像の位置の配列
  let imgs_trans=new Array();

  //背景がなし(0)なら
  if(haikeNum===0){
    //背景あるなら
  }else{
    //入力されたやつが前に入力されたやつと同じなら(空白だった場合は押せない処理が上にある)
    if(text===oldText){
      //以前に文字顔を作っていないなら
      if(mojigaoURL===""){
        //顔周りの装飾系をつなげる（念の為concat）
        images=images.concat(setSosyoku(sosyokuNum));
        //文字顔をimage配列に
        images=images.concat(setMojigao(whichMojigao(text)));

        //todo...位置系の配列を作る
      //前に文字顔が作ってあって、同じやつなら
      }else{
        //顔周りの装飾系をつなげる
        images=images.concat(setSosyoku(sosyokuNum));
        //保存してある文字顔を流用
        images=images.concat(mojigaoURL);
      }
      //使い回せるようにキャンバスを保存する。どの変数に入れるかをセット
      canvasSet[0]=kaoBoshiURL;
    }else{

    }
  }
  oldText=text;//古いtext変数に前のtextを入れる
  loadimages(images,canvaSset,imgs_trans);

}
function whichMojigao(text){//どの文字顔を使うか関数
  const mojitypes = [...Array(mojipos.length).keys()];//文字顔の型(文字の位置)配列の長さの[0,1,2]みたいな番号配列を作る
  while (true){//(ずっと)繰り返す！
    kaotype=Math.floor( Math.random() * mojitypes.length );//文字顔の型(文字の位置)の中からランダムで持ってきてる
    if(((mojipos[mojitypes[kaotype]].length)%(text.length))===0){//ランダムに選んだ文字顔の型が文字数に合いそうなら
      kaotype=mojitypes[kaotype];//番号配列の何番目かになってるんで、文字顔の型(文字の位置)の何番目かに変更
      return;//関数を離脱
    }else{//文字顔の型が文字数に合わなかったら
      mojitypes.splice(kaotype,1);//合わなかったやつを消す
    }
    if(mojitypes.length<=0){//(ないとは思うけど)番号配列の長さが0(以下)になったら
      console.log("文字数に合う文字顔の型がありません。");//ないよーっていう
      return;//関数を離脱
    }
  }
}
function setMojiGaoTrans(){
  let imagestrans=new Array();
  imagestrans.push(koteipos["顔のみ-顔"]);
  imagestrans= imagestrans.concat(mojipos[kaotype]);
  imagestrans.push(koteisize["顔のみ-顔"]);
  imagestrans= imagestrans.concat(mojisize[kaotype]);
  return imagestrans;
}
function setMojigao(kaotype){
  //入力内容
  
  
  var teximages = new Array();
  teximages.push(URLtoImage("https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/%E6%AC%A1%E3%81%9F%E3%82%99.png"));//顔の後ろの白丸みたいなやつを画像配列にいれる。
  ClearCanvas();//キャンバスをクリア

  console.log( mojipos[kaotype].length, mojipos[kaotype],text.length);
  for (let i = 0; i < mojipos[kaotype].length;i+=text.length)//文字顔の型(文字の位置配列)の文字数÷入力された、文字数回繰り返す。
  {
    for(let j=0;j<text.length;j++)//入力された文字の長さ会繰り返す。
    {
      teximages.push(MakeMojiImage(text[j]));//画像配列に文字を追加
    }
  }
  return teximages;
}
function drowsosyoku(kaotype){
 }
function drowkarada(){
 
}

function DrowText(text) {//文字(text)をcanvasに書く変数。
  const ctx = canvas.getContext("2d");//キャンバスの何かを所得(わかってない)
  ctx.font = "48px serif";//フォントを指定
  ctx.fillText(text, 30, 150);//書く。
}
function URLCanvas() {//キャンバスをURLにする関数(いるのかと言われると。。。)
  return canvas.toDataURL();//URLにして返す。
}
function MakeMojiImage(moji) {//文字を画像にするよ関数
  DrowText(moji);//文字をテキストとしてキャンバスに描画
  let image=URLtoImage(URLCanvas());//キャンバスをimageに封じ込める。
  ClearCanvas();//キャンバスをクリア
  return image;//返す
}
function URLtoImage(url){//URLをimage型(？)に変換して返すよ関数
  var image = new Image();//宣言！
  image.crossOrigin="anonymous";//これがないとキャンバスが汚染されてダウンロードとかできなくなる(意味はわかってない)
  image.src =url;//キャンバスをURLにしてimageに代入
  return image;
}

function loadimages(teximages,setCanvasURL,imgs_trans){
  let imgCount=0;
  for (let i = 0; i < teximages.length;i++)//文字顔の型(文字の位置配列)の文字数÷入力された、文字数回繰り返す。
  {
    teximages[i].onload = function () {//画像の読み込みが終わったら
      //顔の後ろのやつだけ重く、顔の後ろのやつが前に来るため、全部のロードが終わってから描画させてる
      imgCount++;//いくつ読み込み終わったか変数を+1
      if (imgCount >= teximages.length) {// すべての画像読み込みが完了した時
        DrowResults(teximages,imgs_trans);//描画
        setCanvasURL[0]=canvas.toDataURL();//文字顔のURLを登録
        console.log(mojigaoURL+"きたきた");
      }
    }
  }
}

function DrowResults(images,img_trans) {// 各画像を順番に描画関数
  let context = canvas.getContext('2d');//キャンパスを所得してる(？)
  console.log(images,img_trans);
  for (var i = 0; i < images.length; i++) {//文字とかの画像回繰り返す
    context.drawImage(images[i], 0, 0, canvas.width/2, canvas.height/2, img_trans[i][0], img_trans[i][1], img_trans[i+(img_trans.length/2)][0], img_trans[i+(img_trans.length/2)][1]);//配列に入ってる位置にいい感じに。
  }
}

function ClearCanvas(){
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}

/***
   <span><span class="circle-big"><span class=title-up>文</span></span></span>
    <span><span class="circle-big"><span class=title-up>字</span></span></span>
    <span><span class="circle-big"><span class=title-up>顔</span></span></span>
    <span><span class="circle-big"><span class=title-up>メ</span></span></span>
    <span><span class="circle-big"><span class=title-up>ー</span></span></span>
    <span><span class="circle-big"><span class=title-up>カ</span></span></span>
    <span><span class="circle-big"><span class=title-up>ー</span></span></span>
  



    //入力されたやつが前に入力されたやつと違うなら(空白だったor全く同じ設定だったらは押せない処理が上にある)
    if(text!==oldText){
      //文字顔のパーツを一旦キャンバスに描画し、image配列に入れる
      images=setMojigao(whichMojigao(text));
      //文字顔のパーツの位置を設定
      imgs_trans=setMojiGaoTrans();
    }
    //一旦文字顔を保存(配列なのは値渡しになっちゃうから)
    canvasSet[0]=mojigaoURL;
  
 */