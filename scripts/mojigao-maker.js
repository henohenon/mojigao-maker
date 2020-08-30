/////所得系
//メッセージを伝えたりするところを所得
const Output_Divided = document.getElementById('output-area');
//「nowmaking...」の要素を所得
const makingText=document.getElementById("making-text");
const makingImage=document.getElementById("making-image");
//入力欄を所得
const TextInput = document.getElementById("input-text");
//キャンバスを所得
const canvas = document.getElementById('board');

//実行ボタンと、ランダムボタン、ダウンロードボタンを所得を所得
const JikkouButton = document.getElementById('jikkou_button');
const RandomButton = document.getElementById('randomu_button');
const DownloadButton = document.getElementById("download_button");
//選択窓を所得
const hatSelect=document.getElementById("hat-select");
const bodySelect=document.getElementById("body-select");
const backgroundSelect=document.getElementById("background-select");



//キャンバスに描画するたびにここにキャンバスを入れてる
var nowCanvasURL = "";
//文字顔のURL
var mojigaoURL = "";

//スリープ関数用の、今画像ロード、描画してるか。
var isload = false;

//いま処理が実行中か。連打された時対策
var isdrow=false;

//文字顔に使われている文字。ダウンロード用
var mojigaotext = "";


//基本のキャンバスのサイズ
const nomalcanvasSize = 300;
//基本のキャンバスに対するサイズ(キャンバスサイズが300の時1)
const canvasRatio=canvas.width/nomalcanvasSize;
//今のキャンバスサイズ
const canvasSize=nomalcanvasSize*canvasRatio;


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
const head_hat_size = (headSize) / hatSize * canvasSize;
//顔が小さくなっちゃうので*30してる
const body_head_size = (headSize+10) / bodySize * canvasSize;


//文字顔の型の配列。くり抜くやつはキャンバスサイズから固定。
const mojitrans=[
  {
    pos:[
      [-50, -150],
      [70, -150],
      [-140, 40]
    ],
    size:[
      [800*canvasRatio, 600*canvasRatio],
      [800*canvasRatio, 600*canvasRatio],
      [1600*canvasRatio, 400*canvasRatio]]
  },
  {
    pos:[
      [-70, -220],
      [70, -220],
      [60, -60],
      [-60, 130] 
    ],
    size:[
      [750*canvasRatio,750*canvasRatio],
      [750*canvasRatio, 750*canvasRatio],
      [480*canvasRatio, 520*canvasRatio],
      [1200*canvasRatio, 240*canvasRatio]]
  },
  {
    pos:[
      [-50, -20],
      [50, -20],
      [-20, -120],
      [90, -120],
      [-70, 20]
    ],
    size:[
      [800*canvasRatio, 200*canvasRatio],
      [800*canvasRatio, 200*canvasRatio],
      [600*canvasRatio, 600*canvasRatio],
      [600, 600*canvasRatio],
      [1200*canvasRatio, 500*canvasRatio]]
  },
  {
    pos:[
      [-20, -80],
      [100, -80],
      [95, 60],
      [125, 60],
      [-60, 130]
    ],
    size:[
      [600*canvasRatio, 448.20*canvasRatio],
      [600*canvasRatio, 448.20*canvasRatio],
      [240*canvasRatio, 260*canvasRatio],
      [240*canvasRatio, 260*canvasRatio],
      [1200*canvasRatio, 240*canvasRatio]]
  },
  {
    pos:[
      [-40, -20],
      [100, -20],
      [-20, -80],
      [100, -80],
      [60, -50],
      [-60, 130]
    ],
    size:[
      [640*canvasRatio, 220*canvasRatio],
      [640*canvasRatio, 220*canvasRatio],
      [600*canvasRatio, 448.20*canvasRatio],
      [600*canvasRatio, 448.20*canvasRatio],
      [480*canvasRatio, 520*canvasRatio],
      [1200*canvasRatio, 240*canvasRatio]]
  },
  {
    pos:[
      [-40, -20],
      [100, -20],
      [-20, -80],
      [100, -80],
      [95, 60],
      [125, 60],
      [-60, 130]
    ],
    size:[
      [640*canvasRatio, 220*canvasRatio],
      [640*canvasRatio, 220*canvasRatio],
      [600*canvasRatio, 448.20*canvasRatio],
      [600*canvasRatio, 448.20*canvasRatio],
      [240*canvasRatio, 260*canvasRatio],
      [240*canvasRatio, 260*canvasRatio],
      [1200*canvasRatio, 240*canvasRatio]]
  },
 
]
//背景と頭と帽子と。みたいな選択肢(？)絵の設定(？)ごとのパーツ(頭とか帽子とか)ごとのくり抜くやつ、サイズ、位置
const koteitrans = {
  head: {
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [canvasSize*2, canvasSize*2] }
  },
  head_hat: {
    head: { kurinuki: [headSize, headSize], pos: [37.5, 40], size: [head_hat_size, head_hat_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  body_head: {
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] }
  },
  background_head: {
    head: { kurinuki: [headSize, headSize], pos: [15, 15], size: [headSize-30, headSize-30] },
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  body_head_hat: {
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [-20, -20], size: [hatSize / bodySize * canvasSize, hatSize / bodySize * canvasSize] }
  },
  background_head_hat: {
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [35, 35], size: [head_hat_size, head_hat_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  background_body_head: {
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] }
  },
  background_body_head_hat: {
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [-22.5, -20], size: [hatSize / bodySize * canvasSize, hatSize / bodySize * canvasSize] }
  }
};


//体によって顔の位置が違うので、体ごとの頭と帽子の位置。
const posByKarada = {
  Sunflower: [80, 50],
  Cat_body: [22.5,30],
  Angel: [40,30],
  Chimera: [135,50],
  Samurai:[120,20]
}
//画像のURLと画像の名前
const image_names={
  hat:[
    {name:"Straw_hat",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/hat/%E9%BA%A6%E3%82%8F%E3%82%89%E5%B8%BD%E5%AD%90.png"},
    {name:"Cat_ear",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/hat/%E3%83%8D%E3%82%B3%E3%83%9F%E3%83%9F.png"},
    {name:"Angel_ring",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/hat/%E5%A4%A9%E4%BD%BF%E3%81%AE%E8%BC%AA.png"},
    {name:"Crown",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/hat/%E7%8E%8B%E5%86%A0.png"},
    {name:"Tyonmage",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/hat/%E3%81%A1%E3%82%87%E3%82%93%E3%81%BE%E3%81%91%E3%82%99.png"},
  ],
  body:[
    {name:"Sunflower",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/body/%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A.png"},
    {name:"Cat_body",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/body/%E3%83%8D%E3%82%B3%E4%BD%93.png"},
    {name:"Angel",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/body/%E5%A4%A9%E4%BD%BF.png"},
    {name:"Chimera",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/body/%E3%82%AD%E3%83%A1%E3%83%A9.png"},
    {name:"Samurai",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/body/%E3%82%B5%E3%83%A0%E3%83%A9%E3%82%A4.png"},
  ],
  background:[
    {name:"Sunflower_field",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/background/%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A%E7%95%91.png"},
    {name:"Japanese_style_house",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/background/%E5%92%8C%E9%A2%A8%E3%81%AE%E5%AE%B6.png"},
    {name:"Halo",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/background/%E5%BE%8C%E5%85%89.png"},
    {name:"Summon",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/background/%E5%8F%AC%E5%96%9A.png"},
    {name:"Castle",URL:"https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/background/%E3%81%B8%E3%81%AE%E5%9F%8E.png"},
  ],
}

//ランダムボタンを押したときに入力欄に出てくる候補達
const random_strings=[
  "へのへぇのぉ",
  "へのへのもへ",
  "へのへの",
  "ジェファー",
  "だが断る！",
  "我こそは",
  "使ってくれぇ",
  "がんばれ！",
  "セーフアウト",
  "こびとのむら",
  "カカポ",
  "つよくいきて",
  "6億円",
  "へ",
  "n高等学校",
  "！",
  "。",
  "文字顔メーカー",
  "文字顔",
  "へへののもへ",
  "因果応報",
  "苦っ！",
  "ぬこ",
  "俺がへのへのだ",
  "新品",
  "コロナ終息！",
  "くじら",
  "フラミンゴ",
  "カモノハシ",
  "クロワッサン",
  "トースト",
  " 椅子取りげぇむ",
  "ぴっずぁ",
  "ケロノワール",
  "望への鏡",
  "へのベロス",
  "へのーんくす",
  "へのがた",
  "へぶと",
  "へっ海道",
  "夢より目標",
  "タイガー岩崎"
]

//ランダムボタンが押されたときの処理
RandomButton.onclick=()=>{
  if(isdrow===false){
    TextInput.value=random_strings[Math.floor(Math.random()*random_strings.length)];
    hatSelect.selectedIndex= Math.floor(Math.random()*(image_names["hat"].length+1));
    bodySelect.selectedIndex= Math.floor(Math.random()*(image_names["body"].length+1));
    backgroundSelect.selectedIndex= Math.floor(Math.random()*(image_names["background"].length+1));
  }else{
    console_output("画像の描画が終わるまでお待ち下さい");
  }
}


//ダウンロードボタンがおされたら、ダウンロードする関数
DownloadButton.onclick = () => {
  //文字顔が空白でないならダウンロードできるようにする
  if(isdrow===false){
    if(nowCanvasURL!==""){
    //aタグを作成
    let link = document.createElement('a');
    //aタグのherf属性にキャンバスをURL化したものを入れる。
    link.href = nowCanvasURL;
    //ダウンロード時の名前を、入力されたテキスト.pngに設定
    link.download = mojigaotext + '.png';
    //リンクを強制的にクリックさせて、ダウンロード
    link.click();
    }else{
      console_output("まだ文字顔が生成されていないため、ダウンロードできません");
    }
  }else{
    console_output("画像の描画が終わるまでお待ち下さい")
  }
}



//ロードと描画が終わるまで待つ処理
function wait(callbackFunc) {
  // 0.3秒間隔で無名関数を実行
  var id = setInterval(function () {
    // 画像のロード、描画が終わった、待機終了。
    if (isload === false) {
      // タイマー停止
      clearInterval(id);
      // 完了時、コールバック関数を実行
      if (callbackFunc) {
        callbackFunc();
      }
    }
  }, 300);
}


//実行ボタンが押されたなら
JikkouButton.onclick = () => {
  console.log(canvasRatio,canvasSize);
  //テキストを入力欄から所得
  let text = TextInput.value;
  //入力欄が空白でないかつ描画中でないなら
  if (isdrow===false) {
    if(text!==""){
      //文字顔の作成を開始
      start_making(text);
    }else{
      console_output("文字を入力してください")
    }
    }else{
      console_output("画像の描画が終わるまでお待ち下さい");
  }
}

//文字顔を作成
function start_making(text){
  //描画中に指定
  isdrow=true;
  //waitするか変数をしてねってする
  isload = true;
  //文字顔の型の番号変数
  let kaotype = 0;
  //描画する画像の配列
  let images = new Array();

  makingImage.style.opacity=0.7;
  makingText.style.opacity=1;

  //文字顔の型を指定
  kaotype = whichMojigao(text);
  //ないはずなんだけど、一応例外処理。
  if(kaotype===undefined){
    console_output("文字数に合う文字顔の型がありません。");
    return;
  }
  //一文字ごとの画像を入れる
  images = setMojigao(text, kaotype);

  //選択窓の番号を所得
  var image_Num = {
    hat: hatSelect.selectedIndex,
    body: bodySelect.selectedIndex,
    background: backgroundSelect.selectedIndex
  }
  
  
  
  //画像の、0,0からどこまでくり抜いたものを描画するか。こんな感じの配列を宣言[[150,150],[150,150],[150,150]...]。
  //[150,150]の数は、文字顔の文字パーツの数+1(顔の後ろの白いやつ)。顔の後ろの白丸と、文字のくり抜くサイズは等しいため
  let img_kurinuki = Array(mojitrans[kaotype]["pos"].length+1).fill(Array(2).fill(canvasSize), Array(2).fill(canvasSize));
  //パーツごとの位置を設定。白丸の位置と、文字ごとの位置を、つないでる
  let img_pos = [koteitrans["head"]["head"].pos].concat(mojitrans[kaotype]["pos"]);
  //上のサイズ版。
  let img_size = [koteitrans["head"]["head"].size].concat(mojitrans[kaotype]["size"]);
  
  //画像をロードが終わるまでまで待ってから描画
  loadimages(images, img_kurinuki, img_pos, img_size);



  //文字顔の描画が終わるまで待つ
  wait(function () {
    //背景など使用しているサブパーツの種類を入れる配列。「ひまわり」とかじゃなくて、「body」とかが入る
    let others_array = new Array();
    //こっちは、使用するサブパーツの種類を「_」でつないだ文字列が入る。
    let others = "";

    //描画するサブパーツの種類順に、使うかを判別
    //背景
    if (image_Num["background"] !== 0) {
      others_array.push("background");
      others += "background_"
    }
    //体
    if (image_Num["body"] !== 0) {
      others_array.push("body");
      others += "body_"
    }
    //顔だけは固定であるので、条件なしに追加
    others += "head_"
    others_array.push("head")
    //帽子
    if (image_Num["hat"] !== 0) {
      others_array.push("hat");
      others += "hat_"
    }
    //使用するパーツを全部つなげた文字列が今とか「head_hat_」なんで、さいごの「_」を削除して「head_hat」とかにする。
    others = others.slice(0, -1);
    
    //顔以外のサブパーツがあるなら
    if (others !== "head") {
      //文字顔のURLを今のキャンバスに設定
      mojigaoURL = nowCanvasURL;
      
      ClearCanvas();
      
      //描画する画像の配列とか、描画する画像の位置配列とかを初期化
      images = [];
      img_kurinuki = [];
      img_pos = [];
      img_size = [];
      
      //foreachでサブパーツそれぞれを、画像配列とかに追加
      others_array.forEach(other => {
        //頭なら、予め格納しておいたものを。それ以外なら、画像配列から。描画する画像配列に格納。
        if (other === "head") {
          images.push(URLtoImage(mojigaoURL));
        } else {
          images.push(URLtoImage(image_names[other][image_Num[other]-1].URL));
        }
        //くり抜く場所を、サブパーツの種類ごとに配列からもらい、描画する画像のくり抜き位置配列に格納
        img_kurinuki.push(koteitrans[others][other].kurinuki);
        //画像のサイズを、サブパーツの種類ごとに配列からもらい、描画する画像位置配列に格納
        img_size.push(koteitrans[others][other].size);
        //身体があるかつ、帽子と顔のいちを追加しようとしているなら。どのの体かによって帽子と顔の位置は、変わるため。
        if (image_Num["body"] !== 0 && (other === "hat" || other === "head")) {
          //体ごとの顔の位置＋帽子の位置が若干違うための微調整。
          img_pos.push([posByKarada[image_names["body"][image_Num["body"]-1].name][0] + koteitrans[others][other].pos[0],
          posByKarada[image_names["body"][image_Num["body"]-1].name][1] + koteitrans[others][other].pos[1]]);
        } else {
          //画像の場所を、サブパーツの種類ごとに配列からもらい、描画する画像の位置配列に格納  
          img_pos.push(koteitrans[others][other].pos);
        }
      });
      //画像のロードが終わるまで待ってから描画。
      loadimages(images, img_kurinuki, img_pos, img_size);
      wait(function() {
        //now making...を消す
        isdrow=false;
        makingText.style.opacity=0;
        makingImage.style.opacity=0;
      })
    }else{
      //now making...を消す
      isdrow=false;
      makingText.style.opacity=0;
      makingImage.style.opacity=0;
    }
  });
  //ダウンロードの名前用の変数に、今の文字顔の文字を代入
  mojigaotext = text;
}


//どの文字顔を使うか関数
function whichMojigao(text) {
  //文字顔の型(文字の位置)配列の長さ分の[0,1,2]みたいな連番の配列を作る
  const mojitypes = [...Array(mojitrans.length).keys()];
  while (true) {
    //連番配列の中から、ランダムで一つ取り出す。
    let kaotype = Math.floor(Math.random() * mojitypes.length);
    //ランダムに選んだ文字顔の型が文字数に合いそうなら
    if (mojitrans[mojitypes[kaotype]]["pos"].length % text.length === 0) {
      //連番配列の何番目かになってるんで、文字顔の型(文字の位置)の何番目かに変更
      kaotype = mojitypes[kaotype];
      return kaotype;
      //文字顔の型が文字数に合わなかったら
    } else {
      //合わなかったやつを連番配列から消す
      mojitypes.splice(kaotype, 1);
    }
    //(ないはずだけど)番号配列の長さが0(以下)になったら(無限ループ対策)
    if (mojitypes.length <= 0) {
      return undefined;
    }
  }
}

//文字顔の型のパーツを、image配列にして渡してる。
function setMojigao(text, kaotype) {
  //画像の配列
  let teximages = new Array();
  //顔の後ろの白丸みたいなやつを画像配列にいれる。
  teximages.push(URLtoImage("https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/%E9%A1%94%E8%83%8C%E6%99%AF.png"));
  ClearCanvas();

  /////短い文字が入力されたときも返せるように二重ループ
  //文字顔のの文字数回繰り返す。一回に付き、入力された文字分を足してる。
  for (let i = 0; i < mojitrans[kaotype]["pos"].length; i += text.length) {
    //入力された文字の長さ回繰り返す。
    for (let j = 0; j < text.length; j++) {
      //画像配列に文字を追加
      teximages.push(MakeMojiImage(text[j]));
    }
  }
  return teximages;
}

//文字を画像にするよ関数
function MakeMojiImage(moji) {
  //文字をテキストとしてキャンバスに描画
  DrowText(moji);
  //キャンバスをimageに封じ込める。
  let image = URLtoImage(canvas.toDataURL());
  ClearCanvas();
  return image;
}

//文字をcanvasに書く変数。
function DrowText(text) {
  //キャンバスの何かを所得(わかってない)
  const ctx = canvas.getContext("2d");
  //フォントを指定
  ctx.font = "48px serif";
  //書く。
  ctx.fillText(text, 30, 150);
}

//URLをimage型(？)に変換して返すよ関数
function URLtoImage(url) {
  var image = new Image();
  //これがないとキャンバスが汚染されてダウンロードとかできなくなる(意味はわかってない)
  image.crossOrigin = "anonymous";
  //URLをimageに代入
  image.src = url;
  return image;
}

//画像のロード完了まで待って、描画する関数
function loadimages(teximages, img_kurinuki, img_pos, img_size) {
  //ロードが終わった画像の数
  let imgCount = 0;
  
  //文字顔の型(文字の位置配列)の文字数÷入力された、文字数回繰り返す。
  for (let i = 0; i < teximages.length; i++) {
    //画像の読み込みが終わったら
    teximages[i].onload = function () {
      //いくつ読み込み終わったか変数を+1
      imgCount++;
      // すべての画像読み込みが完了した時
      if (imgCount >= teximages.length) {
        //描画するよ関数
        DrowResults(teximages, img_kurinuki, img_pos, img_size);
      }
    }
  }
}

// 各画像を順番に描画するよ関数
function DrowResults(images, img_kurinuki, img_pos, img_size) {
  //キャンパスのなにかを所得
  let context = canvas.getContext('2d');
  //文字とかの画像回繰り返す
  for (var i = 0; i < images.length; i++) {
    //配列に入ってる位置とかに画像を描画。
    context.drawImage(images[i], 0, 0, img_kurinuki[i][0], img_kurinuki[i][1], img_pos[i][0], img_pos[i][1], img_size[i][0], img_size[i][1]);
  }
  //今のキャンバスのURLを格納
  nowCanvasURL = canvas.toDataURL();
  //読み込みが終わったことを知らせる。wait関数用
  isload = false;
}
//キャンバスをまっさらにする関数
function ClearCanvas() {
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}



function console_output(text){
  const header = document.createElement('h3');
  header.innerText = text;
  // 診断結果表示エリアの作成
  
  header.style.color="red";
  crea_output();
  Output_Divided.appendChild(header);
  console.log(text);
  setTimeout(
  "crea_output();"
    ,1000)
}

function crea_output(){
  while (Output_Divided.firstChild) {
    // 子どもの要素があるかぎり削除
    Output_Divided.removeChild(Output_Divided.firstChild);
  }
}