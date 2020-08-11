/***
 * 0,0から、画像のサイズまでくり抜いて、サイズをキャンバスに合わせれば、書いた場所に行く。
 ***/

const JikkouButton = document.getElementById('jikkou');
const UrlInput= document.getElementById('url-input');
const resultDivided = document.getElementById('result-area');
const TextInput = document.getElementById("input-text");
const HozonButton = document.getElementById("hozon");
const tokoButton = document.getElementById("toko");
const canvas = document.getElementById('board');

const mugiwaraButton = document.getElementById("mugiwara");


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
  "顔のみ-顔":[[0,0]],
  "顔と装飾-顔":[[0,0]],
  "顔と装飾-装飾":[[0,0]]
}
const koteisize={
  "顔のみ-顔":[[300,300]],
  "顔と装飾-顔":[[300,300]],
  "顔と装飾-装飾":[[300,300]]
}
const sosyoku_URLs={
  "麦わら帽子":"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/sosyoku/%E9%BA%A6%E3%82%8F%E3%82%89%E5%B8%BD%E5%AD%90.png"
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
  link.href = URLCanvas();//URLCanvas();

  link.download = oldText+'.png';
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
  karadaNum=1;

}
mugiwaraButton.onclick=()=>{
  sosyokuNum=1;

}


function sleep(waitSec, callbackFunc) {
 
  // 経過時間（秒）
  var spanedSec = 0;

  // 1秒間隔で無名関数を実行
  var id = setInterval(function () {

      spanedSec++;

      // 経過時間 >= 待機時間の場合、待機終了。
      if (spanedSec >= waitSec) {

          // タイマー停止
          clearInterval(id);

          // 完了時、コールバック関数を実行
          if (callbackFunc) callbackFunc();
      }
  }, 1000);

}


//todo。。。入力が空白なら押せないようにする。
JikkouButton.onclick = () => {
  let text=TextInput.value;//入力された単語(?)
  let kaotype=0;


  let images=new Array();
  //作ったキャンバスを何に入れるか。変数を渡したいんだけど、値渡しになっちゃうから配列
  let canvasSet=new Array();
  
  
  
  kaotype=whichMojigao(text);
  console.log(kaotype,text,whichMojigao(text));
  images=setMojigao(text,kaotype);
  
  
  //要するにこんな感じの配列を宣言してる。[150,150]の数は、文字顔の文字パーツの数+1(顔の後ろの白いやつ)。[[150,150],[150,150],[150,150]...]
  let img_kurinuki=Array(mojipos[kaotype].length+1).fill(Array(2).fill(150),Array(2).fill(150));
  let img_pos=images_pos= koteipos["顔のみ-顔"].concat(mojipos[kaotype]);
  let img_size=images_pos= koteisize["顔のみ-顔"].concat(mojisize[kaotype]);
  
  loadimages(images,img_kurinuki,img_pos,img_size);
  console.log("えーっと？");
  if(sosyokuNum!==0){
    sleep(1,function () {
      ClearCanvas();
      images=[URLtoImage(mojigaoURL),URLtoImage(sosyoku_URLs[sosyokuNum-1])];
      img_kurinuki=[[300,300],[400,400]];
      img_pos=[koteipos["顔と装飾-顔"],koteipos["顔と装飾-装飾"]];
      img_size=[koteisize["顔と装飾-顔"],koteisize["顔と装飾-装飾"]];
      loadimages(images,img_kurinuki,img_pos,img_size);
    });
  }
  
  
/*
  //背景がなし(0)なら
  if(haikeNum===0){
  //体がなし(0)なら
  if(karadaNum===0){
    //装飾(防止とか)がなし(0)なら
    if(sosyokuNum===0){
      /////背景も体も装飾もなし
      kaotype= whichMojigao(text);
      images=images.concat(setMojigao(kaotype));
      imgs_trans=imgs_trans.concat(setMojigaotrans(kaotype,"顔のみ-顔"));
    //装飾(防止とか)あるなら
    }else{
      /////背景・体なし、装飾あり
      kaotype= whichMojigao(text);
      images=images.concat(setMojigao(kaotype));
      images=images.concat(setSoshoku(sosyokuNum));
      imgs_trans=imgs_trans.concat(setMojigaotrans(kaotype));
      imgs_trans=imgs_trans.concat(setSoshokutrans(sosyokuNum));
    }
  //体あるなら
  }else{
    //装飾(防止とか)がなし(0)なら
    if(sosyokuNum===0){
      /////背景なし、体・装飾あり
      kaotype= whichMojigao(text);
      images=images.concat(setKarada(karadaNum));
      images=images.concat(setMojigao(kaotype));
      images=images.concat(setSoshoku(sosyokuNum));
      imgs_trans=imgs_trans.concat(setKaradatrans(karadaNum));
      imgs_trans=imgs_trans.concat(setMojigaotrans(kaotype));
      imgs_trans=imgs_trans.concat(setSoshokutrans(sosyokuNum));
      //装飾(防止とか)あるなら
    }else{
      /////背景・装飾なし、体あり
      kaotype= whichMojigao(text);
      images=images.concat(setKarada(karadaNum));
      images=images.concat(setMojigao(kaotype));
      imgs_trans=imgs_trans.concat(setKaradatrans(karadaNum));
      imgs_trans=imgs_trans.concat(setMojigaotrans(kaotype));
    }
  }
  //背景あるなら
  }else{
    //体がなし(0)なら
    if(karadaNum===0){
      //装飾(防止とか)がなし(0)なら
      if(sosyokuNum===0){
        //////装飾・体なし、背景あり
        kaotype= whichMojigao(text);
        images=images.concat(setHaike(haikeNum));
        images=images.concat(setMojigao(kaotype));
        imgs_trans=imgs_trans.concat(setHaiketrans(haikeNum));
        imgs_trans=imgs_trans.concat(setMojigaotrans(kaotype));
        //装飾(防止とか)あるなら
      }else{
        /////装飾・背景あり、体なし
        kaotype= whichMojigao(text);
        images=images.concat(setHaike(haikeNum));
        images=images.concat(setMojigao(kaotype));
        images=images.concat(setSoshoku(sosyokuNum));
        imgs_trans=imgs_trans.concat(setHaiketrans(haikeNum));
        imgs_trans=imgs_trans.concat(setMojigaotrans(kaotype));
        imgs_trans=imgs_trans.concat(setSoshokutrans(sosyokuNum));
      }
    //体あるなら
    }else{
      //装飾(防止とか)がなし(0)なら
      if(sosyokuNum===0){
        /////体・背景あり、装飾なし
        kaotype= whichMojigao(text);
        images=images.concat(setHaike(haikeNum));
        images=images.concat(setKarada(karadaNum));
        images=images.concat(setMojigao(kaotype));
        imgs_trans=imgs_trans.concat(setHaiketrans(haikeNum));
        imgs_trans=imgs_trans.concat(setKaradatrans(karadaNum));
        imgs_trans=imgs_trans.concat(setMojigaotrans(kaotype));
      //装飾(防止とか)あるなら
      }else{
        /////背景・体・装飾、全部あり
        kaotype= whichMojigao(text);
        images=images.concat(setHaike(haikeNum));
        images=images.concat(setKarada(karadaNum));
        images=images.concat(setMojigao(kaotype));
        images=images.concat(setSoshoku(sosyokuNum));
        imgs_trans=imgs_trans.concat(setHaiketrans(haikeNum));
        imgs_trans=imgs_trans.concat(setKaradatrans(karadaNum));
        imgs_trans=imgs_trans.concat(setMojigaotrans(kaotype));
        imgs_trans=imgs_trans.concat(setSoshokutrans(sosyokuNum));
      }
    }
  }
*/
  oldText=text;//古いtext変数に前のtextを入れる

}
function whichMojigao(text){//どの文字顔を使うか関数
  const mojitypes = [...Array(mojipos.length).keys()];//文字顔の型(文字の位置)配列の長さの[0,1,2]みたいな番号配列を作る
  while (true){//(ずっと)繰り返す！
    let kaotype=Math.floor( Math.random() * mojitypes.length );//文字顔の型(文字の位置)の中からランダムで持ってきてる
    if(((mojipos[mojitypes[kaotype]].length)%(text.length))===0){//ランダムに選んだ文字顔の型が文字数に合いそうなら
      kaotype=mojitypes[kaotype];//番号配列の何番目かになってるんで、文字顔の型(文字の位置)の何番目かに変更
      return kaotype;//関数を離脱
    }else{//文字顔の型が文字数に合わなかったら
      mojitypes.splice(kaotype,1);//合わなかったやつを消す
    }
    if(mojitypes.length<=0){//(ないとは思うけど)番号配列の長さが0(以下)になったら
      console.log("文字数に合う文字顔の型がありません。");//ないよーっていう
      return;//関数を離脱
    }
  }
}
function setMojigaotrans(kaotype,kaopos){
  let imagestrans=new Array();
  imagestrans.push(koteipos[kaopos]);
  imagestrans= imagestrans.concat(mojipos[kaotype]);
  imagestrans.push(koteisize[kaopos]);
  imagestrans= imagestrans.concat(mojisize[kaotype]);
  return imagestrans;
}
function setMojigao( text,kaotype){
  //入力内容
  
  console.log(kaotype);
  let teximages = new Array();
  teximages.push(URLtoImage("https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/%E9%A1%94%E8%83%8C%E6%99%AF.png"));//顔の後ろの白丸みたいなやつを画像配列にいれる。
  ClearCanvas();//キャンバスをクリア

  for (let i = 0; i < mojipos[kaotype].length;i+=text.length)//文字顔の型(文字の位置配列)の文字数÷入力された、文字数回繰り返す。
  {
    for(let j=0;j<text.length;j++)//入力された文字の長さ会繰り返す。
    {
      teximages.push(MakeMojiImage(text[j]));//画像配列に文字を追加
    }
  }
  return teximages;
}
function setSoshoku(soshokuNumb){
  let teximages = new Array();
  teximages.push(URLtoImage(sosyoku_URLs[soshokuNumb]));//顔の後ろの白丸みたいなやつを画像配列にいれる。
  ClearCanvas();//キャンバスをクリア
  return teximages;  
}
function setKarada(karadaNumb){
  let teximages = new Array();
  teximages.push(URLtoImage(karada_URLs[karadaNumb]));//顔の後ろの白丸みたいなやつを画像配列にいれる。
  ClearCanvas();//キャンバスをクリア
  return teximages;   
}
function setHaike(haikeNumb){
  let teximages = new Array();
  teximages.push(URLtoImage(haike_URLs[haikeNumb]));//顔の後ろの白丸みたいなやつを画像配列にいれる。
  ClearCanvas();//キャンバスをクリア
  return teximages;   
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

function loadimages(teximages,img_kurinuki,img_pos,img_size){
  let imgCount=0;
  
  for (let i = 0; i < teximages.length;i++)//文字顔の型(文字の位置配列)の文字数÷入力された、文字数回繰り返す。
  {
    teximages[i].onload = function () {//画像の読み込みが終わったら
      //顔の後ろのやつだけ重く、顔の後ろのやつが前に来るため、全部のロードが終わってから描画させてる
      imgCount++;//いくつ読み込み終わったか変数を+1
      if (imgCount >= teximages.length) {// すべての画像読み込みが完了した時
        DrowResults(teximages,img_kurinuki,img_pos,img_size);//描画
        console.log("きてる？");
        mojigaoURL=canvas.toDataURL();//文字顔のURLを登録
      }
    }
  }
}

function DrowResults(images,img_kurinuki,img_pos,img_size) {// 各画像を順番に描画関数
  let context = canvas.getContext('2d');//キャンパスを所得してる(？)
  //console.log(images,img_trans);
  //ClearCanvas();
  for (var i = 0; i < images.length; i++) {//文字とかの画像回繰り返す
    context.drawImage(images[i], 0, 0, img_kurinuki[i][0], img_kurinuki[i][1], img_pos[i][0], img_pos[i][1], img_size[i][0], img_size[i][1]);//配列に入ってる位置にいい感じに。
  }
}
function ClearCanvas(){
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  console.log("くりあ");
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