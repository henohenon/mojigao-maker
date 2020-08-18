/////所得系
//メッセージを伝えたりするところを所得
const resultDivided = document.getElementById('result-area');
//入力欄を所得
const TextInput = document.getElementById("input-text");
//キャンバスを所得
const canvas = document.getElementById('board');

//実行ボタンと、ダウンロードボタンを所得
const JikkouButton = document.getElementById('jikkou_button');
const HozonButton = document.getElementById("download_button");

//帽子系のボタンを所得
const noneButton = document.getElementById("none-hat_button");
const mugiwaraButton = document.getElementById("mugiwara_button");

//体系のボタンを所得
const himawariButton = document.getElementById("himawari_button");

//背景系のボタンを所得
const Sunflower_fieldButton = document.getElementById("Sunflower_field_button");


//キャンバスに描画するたびにここにキャンバスを入れてる
var nowCanvasURL = "";
//文字顔のURL
var mojigaoURL = "";

//スリープ関数用の、今画像ロードしてるか。
var isload = false;

//文字の場所。パターンがいくつかの中にそれぞれの文字の場所のx座標とy座標
const mojipos =
  [
    [
      [-50, -150],
      [70, -150],
      [-140, 40]
    ],
    [
      [-100, -220],
      [30, -220],
      [60, -60],
      [-60, 130]
    ],
    [
      [-20, -10],
      [100, -10],
      [-20, -70],
      [100, -70],
      [-60, 110]
    ],
    [
      [-40, -20],
      [100, -20],
      [-20, -80],
      [100, -80],
      [60, -50],
      [-60, 130]
    ]
  ];
//パターンがいくつかの中にそれぞれの文字のxのサイズとyのサイズ
const mojisize =
  [
    [
      [400, 300],
      [400, 300],
      [800, 200]
    ],
    [
      [500, 375],
      [500, 375],
      [240, 260],
      [600, 120]
    ],
    [
      [320, 110],
      [320, 110],
      [300, 225],
      [300, 225],
      [600, 120]
    ],
    [
      [320, 110],
      [320, 110],
      [300, 224.10],
      [300, 224.10],
      [240, 260],
      [600, 120]
    ]
  ];




//キャンバスのサイズとりあえず手動
const canvasSize = 300;

//背景画像のサイズ:700*700
const backgrountSize = 700;
//体画像のサイズ:650*650
const bodySize = 650;
//顔のサイズ:300*300
const headSize = 300;
// 帽子画像のサイズ:400*400
const hatSize = 400;

/////たくさん使う数は変数に格納。
//顔が小さくなっちゃうので*30してる
const head_hat_size = (headSize + 30) / hatSize * canvasSize;
//顔が小さくなっちゃうので*30してる
const body_head_size = (headSize + 30) / bodySize * canvasSize;

/////背景と頭と帽子と。みたいな選択肢(？)絵の設定(？)ごとのパーツ(頭とか帽子とか)ごとのくり抜くやつ、サイズ、位置
const koteitrans = {
  head:{
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  head_hat:{
    head: { kurinuki: [headSize, headSize], pos: [20, 30], size: [head_hat_size, head_hat_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  body_head:{
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] }
  },
  background_head:{
    head: { kurinuki: [headSize, headSize], pos: [25, 25], size: [head_hat_size, head_hat_size] },
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  body_head_hat:{
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [-15, -20], size: [hatSize / bodySize * canvasSize, hatSize / bodySize * canvasSize] }
  },
  background_head_hat:{
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [20, 30], size: [head_hat_size, head_hat_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  background_body_head:{
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] }
  },
  background_body_head_hat:{
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [-10, -20], size: [hatSize / backgrountSize * canvasSize, hatSize / backgrountSize * canvasSize] }
  }
};

////体とかの画像のURL達。
const image_URLs = {
  hat:
    [
      { name: "Straw_hat", URL: "https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/sosyoku/%E9%BA%A6%E3%82%8F%E3%82%89%E5%B8%BD%E5%AD%90.png" }
    ],
  body:
    [
      { name: "Sunflower", URL: "https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/karada/%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A.png" }
    ],
  background:
    [
      { name: "Sunflower_field", URL: "https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/haike/%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A%E7%95%91.png" }
    ]
}

////体によって顔の位置が違うので、体ごとの頭と帽子の位置。
const posByKarada = {
  Sunflower: [75.5, 45]
}
/////体、帽子、背景の、それぞれどれを使うか。
var image_Num = {
  hat: 0,
  body: 0,
  background: 0
}





/////ダウンロードボタンがおされたら、ダウンロードする関数
HozonButton.onclick = () => {
  let link = document.createElement('a');
  link.href = URLCanvas();

  link.download = oldText + '.png';
  /***
  if(text!==""){
  }else{
    link.download = text+'.png';
  }
  ***/
  link.click();
}

mugiwaraButton.onclick = () => {
  image_Num["hat"] = 1;

}
noneButton.onclick = () => {
  image_Num["hat"] = 0;

}
himawariButton.onclick = () => {
  image_Num["body"] = 1;

}
Sunflower_fieldButton.onclick = () => {
  image_Num["background"] = 1;

}




function sleep(callbackFunc) {

  // 経過時間（秒）

  // 1秒間隔で無名関数を実行
  var id = setInterval(function () {


    // 経過時間 >= 待機時間の場合、待機終了。
    if (isload === false) {

      // タイマー停止
      clearInterval(id);

      // 完了時、コールバック関数を実行
      if (callbackFunc) callbackFunc();
    }
  }, 1000);

}


//todo。。。入力が空白なら押せないようにする。
JikkouButton.onclick = () => {
  isload = true;
  let text = TextInput.value;//入力された単語(?)
  let kaotype = 0;


  let images = new Array();
  //作ったキャンバスを何に入れるか。変数を渡したいんだけど、値渡しになっちゃうから配列
  let canvasSet = new Array();



  kaotype = whichMojigao(text);
  console.log(kaotype, text, whichMojigao(text));
  images = setMojigao(text, kaotype);


  //要するにこんな感じの配列を宣言してる。[150,150]の数は、文字顔の文字パーツの数+1(顔の後ろの白いやつ)。[[150,150],[150,150],[150,150]...]
  let img_kurinuki = Array(mojipos[kaotype].length + 1).fill(Array(2).fill(150), Array(2).fill(150));
  console.log(koteitrans["head"]["head"].pos,koteitrans["head"]["head"].size)
  let img_pos = images_pos = [koteitrans["head"]["head"].pos].concat(mojipos[kaotype]);
  let img_size = images_pos = [koteitrans["head"]["head"].size].concat(mojisize[kaotype]);

  loadimages(images, img_kurinuki, img_pos, img_size);
  sleep(function () {

    let others_array = new Array();
    let others = "";

    if (image_Num["background"] !== 0) {
      others_array.push("background");
      others += "background_"
    }
    if (image_Num["body"] !== 0) {
      others_array.push("body");
      others += "body_"
    }
    others += "head_"
    others_array.push("head")
    if (image_Num["hat"] !== 0) {
      others_array.push("hat");
      others += "hat_"
    }
    others = others.slice(0, -1);

    if (others !== "head") {
      ClearCanvas();
      mojigaoURL = nowCanvasURL;
      images = [];
      img_kurinuki = [];
      img_pos = [];
      img_size = [];
      others_array.forEach(other => {
        if (other === "head") {
          images.push(URLtoImage(mojigaoURL));
        } else {
          images.push(URLtoImage(image_URLs[other][image_Num[other] - 1].URL));
        }
        console.log(others + "-" + other);
        img_kurinuki.push(koteitrans[others][other].kurinuki);
        img_size.push(koteitrans[others][other].size);
        if (image_Num["body"] !== 0 && (other === "hat" || other === "head")) {
          img_pos.push([posByKarada[image_URLs["body"][image_Num["body"] - 1].name][0] + koteitrans[others][other].pos[0], posByKarada[image_URLs["body"][image_Num["body"] - 1].name][1] + koteitrans[others][other].pos[1]]);
        } else {
          img_pos.push(koteitrans[others][other].pos)
        }
      });
      console.log("アホか俺");
      loadimages(images, img_kurinuki, img_pos, img_size);

    }
  });

  oldText = text;//古いtext変数に前のtextを入れる

}
function whichMojigao(text) {//どの文字顔を使うか関数
  const mojitypes = [...Array(mojipos.length).keys()];//文字顔の型(文字の位置)配列の長さの[0,1,2]みたいな番号配列を作る
  while (true) {//(ずっと)繰り返す！
    let kaotype = Math.floor(Math.random() * mojitypes.length);//文字顔の型(文字の位置)の中からランダムで持ってきてる
    if (((mojipos[mojitypes[kaotype]].length) % (text.length)) === 0) {//ランダムに選んだ文字顔の型が文字数に合いそうなら
      kaotype = mojitypes[kaotype];//番号配列の何番目かになってるんで、文字顔の型(文字の位置)の何番目かに変更
      return kaotype;//関数を離脱
    } else {//文字顔の型が文字数に合わなかったら
      mojitypes.splice(kaotype, 1);//合わなかったやつを消す
    }
    if (mojitypes.length <= 0) {//(ないとは思うけど)番号配列の長さが0(以下)になったら
      console.log("文字数に合う文字顔の型がありません。");//ないよーっていう
      return;//関数を離脱
    }
  }
}
function setMojigaotrans(kaotype, kaopos) {
  let imagestrans = new Array();
  imagestrans.push(koteipos[kaopos]);
  imagestrans = imagestrans.concat(mojipos[kaotype]);
  imagestrans.push(koteisize[kaopos]);
  imagestrans = imagestrans.concat(mojisize[kaotype]);
  return imagestrans;
}
function setMojigao(text, kaotype) {
  //入力内容

  console.log(kaotype);
  let teximages = new Array();
  teximages.push(URLtoImage("https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/%E9%A1%94%E8%83%8C%E6%99%AF.png"));//顔の後ろの白丸みたいなやつを画像配列にいれる。
  ClearCanvas();//キャンバスをクリア

  for (let i = 0; i < mojipos[kaotype].length; i += text.length)//文字顔の型(文字の位置配列)の文字数÷入力された、文字数回繰り返す。
  {
    for (let j = 0; j < text.length; j++)//入力された文字の長さ会繰り返す。
    {
      teximages.push(MakeMojiImage(text[j]));//画像配列に文字を追加
    }
  }
  return teximages;
}
function setSoshoku(soshokuNumb) {
  let teximages = new Array();
  teximages.push(URLtoImage(sosyoku_URLs[soshokuNumb]));//顔の後ろの白丸みたいなやつを画像配列にいれる。
  ClearCanvas();//キャンバスをクリア
  return teximages;
}
function setKarada(karadaNumb) {
  let teximages = new Array();
  teximages.push(URLtoImage(karada_URLs[karadaNumb]));//顔の後ろの白丸みたいなやつを画像配列にいれる。
  ClearCanvas();//キャンバスをクリア
  return teximages;
}
function setHaike(haikeNumb) {
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
  let image = URLtoImage(URLCanvas());//キャンバスをimageに封じ込める。
  ClearCanvas();//キャンバスをクリア
  return image;//返す
}
function URLtoImage(url) {//URLをimage型(？)に変換して返すよ関数
  var image = new Image();//宣言！
  image.crossOrigin = "anonymous";//これがないとキャンバスが汚染されてダウンロードとかできなくなる(意味はわかってない)
  image.src = url;//キャンバスをURLにしてimageに代入
  return image;
}

function loadimages(teximages, img_kurinuki, img_pos, img_size) {
  let imgCount = 0;

  for (let i = 0; i < teximages.length; i++)//文字顔の型(文字の位置配列)の文字数÷入力された、文字数回繰り返す。
  {
    console.log(teximages);
    teximages[i].onload = function () {//画像の読み込みが終わったら
      //顔の後ろのやつだけ重く、顔の後ろのやつが前に来るため、全部のロードが終わってから描画させてる
      imgCount++;//いくつ読み込み終わったか変数を+1
      if (imgCount >= teximages.length) {// すべての画像読み込みが完了した時

        DrowResults(teximages, img_kurinuki, img_pos, img_size);//描画
      }
    }
  }
}

function DrowResults(images, img_kurinuki, img_pos, img_size) {// 各画像を順番に描画関数
  let context = canvas.getContext('2d');//キャンパスを所得してる(？)
  //console.log(images,img_trans);
  //ClearCanvas();
  for (var i = 0; i < images.length; i++) {//文字とかの画像回繰り返す
    context.drawImage(images[i], 0, 0, img_kurinuki[i][0], img_kurinuki[i][1], img_pos[i][0], img_pos[i][1], img_size[i][0], img_size[i][1]);//配列に入ってる位置にいい感じに。
    //context.drawImage(mugi, 0, 0, 300, 300,100*i,100*i, 300,300);//配列に入ってる位置にいい感じに。
  }
  console.log("どうだ？");
  nowCanvasURL = canvas.toDataURL();//文字顔のURLを登録
  isload = false;
}
function ClearCanvas() {
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  console.log("くりあ");
}