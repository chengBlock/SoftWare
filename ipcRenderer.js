//-------------- 全局变量 ---------------//
var { ipcRenderer, remote } = require("electron");
var fs = require("fs");
const iconvLite = require("iconv-lite");
//表示编码格式：utf8和gbk
const utf8 = "(utf8)";
const gbk = "(gbk)";
let codeFormatter = utf8; //默认编码为utf8
var textAreaDom = document.querySelector("#editor"); //获取工作区dom
//-----------方帕思写的代码--开始-------------//
var editor; //工作区的变量
//获取状态栏的对象
var hang = document.getElementById("hang");
var yuyan = document.getElementById("yuyan");
var bianma = document.getElementById("bianma");
var zhuti = document.getElementById("zhuti");
//-----------方帕思写的代码--结束-------------//
var isSave = true; //判断文件是否保存
var currentFile = ""; //保存当前文件的路径

//-------------- 主程序--开始 ---------------//

document.title = "无标题";
initEdittor(); //执行初始化工作区

/*
问题：
    1、新建 打开 保存的问题

    2、如果已经保存 第二次保存的时候不提示直接保存

    3、判断文件是否已经保存  改变软件左上角的内容

*/

//内容变化的时候 让isSave等于false
textAreaDom.oninput = function () {
  if (isSave) {
    document.title += " *";
  }
  isSave = false;
  var lines = editor.session.getLength();
  hang.innerHTML = lines; //设置状态栏的总行数
};

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  ipcRenderer.send("contextMenu");
});

//监听主进程的操作
ipcRenderer.on("action", function (event, action) {
  console.log(action);

  switch (action) {
    case "new":
      //判断文件是否保存  如果没有保存提示   并保存
      askSaveDialog();

      setContent("--code here--"); //方帕思写的
      currentFile = "";
      document.title = "无标题";

      //默认使用utf8，程春亮
      codeFormatter = utf8;
      bianma.innerHTML = "UTF-8"; //设置状态栏
      break;

    case "open":
      //判断文件是否保存  如果没有保存提示   并保存
      askSaveDialog();

      //通过dialog打开文件
      openDialog();
      break;

    case "save":
      saveCurrentDoc();
      break;

    //--------方帕思写的代码--2020/5/17-------//
    //---设置语言模式---//
    case "assembly_x86":
      setMode(action);
      yuyan.innerHTML = "Assembly"; //设置状态栏
      break;

    case "c_cpp":
      setMode(action);
      yuyan.innerHTML = "C/C++"; //设置状态栏
      break;

    case "csharp":
      setMode(action);
      yuyan.innerHTML = "C#"; //设置状态栏
      break;

    case "css":
      setMode(action);
      yuyan.innerHTML = "CSS"; //设置状态栏
      break;

    case "html":
      setMode(action);
      yuyan.innerHTML = "HTML"; //设置状态栏
      break;

    case "java":
      setMode(action);
      yuyan.innerHTML = "Java"; //设置状态栏
      break;

    case "javascript":
      setMode(action);
      yuyan.innerHTML = "JavaScript"; //设置状态栏
      break;

    case "lua":
      setMode(action);
      yuyan.innerHTML = "Lua"; //设置状态栏
      break;

    case "matlab":
      setMode(action);
      yuyan.innerHTML = "Matlab"; //设置状态栏
      break;

    case "perl":
      setMode(action);
      yuyan.innerHTML = "Perl"; //设置状态栏
      break;

    case "php":
      setMode(action);
      yuyan.innerHTML = "PHP"; //设置状态栏
      break;

    case "python":
      setMode(action);
      yuyan.innerHTML = "Python"; //设置状态栏
      break;

    case "r":
      setMode(action);
      yuyan.innerHTML = "R"; //设置状态栏
      break;

    case "rust":
      setMode(action);
      yuyan.innerHTML = "Rust"; //设置状态栏
      break;

    case "sql":
      setMode(action);
      yuyan.innerHTML = "SQL"; //设置状态栏
      break;

    case "swift":
      setMode(action);
      yuyan.innerHTML = "Swift"; //设置状态栏
      break;

    case "verilog":
      setMode(action);
      yuyan.innerHTML = "Verilog"; //设置状态栏
      break;
    //---设置主题---//
    case "cobalt":
      setThemes(action);
      zhuti.innerHTML = "Cobalt"; //设置状态栏
      break;

    case "eclipse":
      setThemes(action);
      zhuti.innerHTML = "Eclipse"; //设置状态栏
      break;

    case "monokai":
      setThemes(action);
      zhuti.innerHTML = "Monokai"; //设置状态栏
      break;

    case "solarized_dark":
      setThemes("twilight");
      zhuti.innerHTML = "Solarized_dark"; //设置状态栏
      break;

    case "solarized_light":
      setThemes(action);
      zhuti.innerHTML = "Solarized_light"; //设置状态栏
      break;

    case "vibrant_ink":
      setThemes(action);
      zhuti.innerHTML = "Vibrant_ink"; //设置状态栏
      break;

    case "terminal":
      setThemes(action);
      zhuti.innerHTML = "terminal"; //设置状态栏
      break;
    //---------方帕思写的代码--已结束----------//
    //程春亮新增编码菜单
    case "changeTo_utf8":
      changeCodeFormatter("toUTF8");
      bianma.innerHTML = "UTF-8"; //设置状态栏
      break;

    case "changeTo_gbk":
      changeCodeFormatter("toGBK");
      bianma.innerHTML = "GBK"; //设置状态栏
      break;
    default:
      break;
  }
});

//-------------- 主程序--结束 ---------------//

//-------------- 函数 ---------------//
// (1) 判断文件是否保存并执行保存功能
function askSaveDialog() {
  if (!isSave) {
    index = remote.dialog.showMessageBoxSync({
      type: "question",
      message: "是否要保存此文件?",
      buttons: ["Yes", "No"],
    });
    console.log(index);

    if (index == 0) {
      //执行保存操作
      saveCurrentDoc();
    }
  }
}

// (2) 执行保存的方法
function saveCurrentDoc() {
  if (!currentFile) {
    //当前文件路径不存在 提示保存
    const result = remote.dialog.showSaveDialogSync({
      defaultPath: "aaa.txt",
      filters: [
        {
          name: "All Files",
          extensions: ["*"],
        },
      ],
    });
    if (result != undefined) {
      if (result) {
        currentFile = result;
        //程春亮
        if (codeFormatter === utf8) {
          fs.writeFileSync(currentFile, getContent());
        } else {
          fs.writeFileSync(currentFile, iconvLite.encode(getContent(), "gbk"));
        }
        isSave = true;
        //改变文件标题
        document.title = currentFile;
        //朱康希添加代码
        setAutoMode(); //自动设置语言模式
        //朱康希添加代码结束
      }
    }
  } else {
    //程春亮
    if (codeFormatter === utf8) {
      fs.writeFileSync(currentFile, getContent());
    } else {
      fs.writeFileSync(currentFile, iconvLite.encode(getContent(), "gbk"));
    }
    isSave = true;
    //改变软件的标题
    document.title = currentFile;

    //朱康希添加代码
    setAutoMode(); //自动设置语言模式
    //朱康希添加代码结束
  }
  var lines = editor.session.getLength();
  hang.innerHTML = lines; //设置状态栏
}

// (3) 打开文件管理器，选择文件并打开
function openDialog() {
  var results = remote.dialog.showOpenDialogSync({
    properties: ["openFile"],
  });
  if (results != undefined) {
    if (results[0]) {
      var fsData = fs.readFileSync(results[0]); //获取文件里面的东西
      currentFile = results[0];
      document.title = currentFile;
      //程春亮

      if (isUTF8(fsData)) {
        codeFormatter = utf8;
        bianma.innerHTML = "UTF-8"; //设置状态栏
        setContent(fsData.toString());
      } else {
        codeFormatter = gbk;
        bianma.innerHTML = "GBK"; //设置状态栏
        setContent(iconvLite.decode(fsData, "gbk"));
      }
    }
    //朱康希添加代码
    setAutoMode(); //自动设置语言模式
    //朱康希添加代码结束
    var lines = editor.session.getLength();
    hang.innerHTML = lines;
  }
}
//---------- 程春亮 --开始-----------//
// (4) 转换编码格式
function changeCodeFormatter(str) {
  //转码时报存当前工作区内容，避免未保存内容丢失
  saveCurrentDoc();
  var fsData = fs.readFileSync(currentFile); //读取
  if (str === "toUTF8") {
    //当前是GBK模式 编码本身也是GBK
    if (codeFormatter !== utf8 && !isUTF8(fsData)) {
      temp = iconvLite.decode(fsData, "gbk");
      codeFormatter = utf8; //设置编码格式
      fs.writeFileSync(currentFile, temp); //写入文件
      setContent("");
      fsData = fs.readFileSync(currentFile); //读取
      setContent(fsData.toString());
      console.log("转为utf8成功");
    }
  } else if (str === "toGBK") {
    //当前是UTF8模式 编码本身也是UTF8
    if (codeFormatter !== gbk) {
      codeFormatter = gbk; //设置编码格式
      fs.writeFileSync(currentFile, iconvLite.encode(fsData, "gbk")); //写入文件
      setContent("");
      var fsData = fs.readFileSync(currentFile); //读取
      setContent(iconvLite.decode(fsData, "gbk"));
      console.log("转为GBK成功");
    }
  }
}
// (5) 判断是否为utf8格式
function isUTF8(rawtext) {
  let score = 0;
  let rawtextlen = 0;
  let goodbytes = 0;
  let asciibytes = 0;

  rawtextlen = rawtext.length;

  for (let i = 0; i < rawtextlen; i++) {
    //最高位是0的ASCII字符
    //一位编码的情况
    if ((rawtext[i] & 0x7f) == rawtext[i]) {
      asciibytes++;
      //两位编码的情况,第一位11000000--11011111
      //后一位跟10000000--10111111
    } else if (
      i + 1 < rawtextlen &&
      0b11000000 <= rawtext[i] &&
      rawtext[i] <= 0b11011111 &&
      0b10000000 <= rawtext[i + 1] &&
      rawtext[i + 1] <= 0b10111111
    ) {
      goodbytes += 2;
      i++;
      //三位编码的情况,第一位11100000--11101111
      //后两位跟10000000--10111111
    } else if (
      0b11100000 <= rawtext[i] &&
      rawtext[i] <= 0b11101111 &&
      i + 2 < rawtextlen &&
      0b10000000 <= rawtext[i + 1] &&
      rawtext[i + 1] <= 0b10111111 &&
      -0b10000000 <= rawtext[i + 2] &&
      rawtext[i + 2] <= 0b10111111
    ) {
      goodbytes += 3;
      i += 2;
      //四位编码的情况,第一位11110000--11110111
      //后三位跟10000000--10111111
    } else if (
      0b11110000 <= rawtext[i] &&
      rawtext[i] <= 0b11110111 &&
      i + 3 < rawtextlen &&
      0b10000000 <= rawtext[i + 1] &&
      rawtext[i + 1] <= 0b10111111 &&
      0b10000000 <= rawtext[i + 2] &&
      rawtext[i + 2] <= 0b10111111 &&
      0b10000000 <= rawtext[i + 3] &&
      rawtext[i + 3] <= 0b10111111
    ) {
      goodbytes += 4;
      i += 3;
    }
  }
  if (asciibytes == rawtextlen) {
    return true;
  }
  score = (100 * goodbytes) / (rawtextlen - asciibytes);
  //如果匹配率达到98%以上,则成功
  //允许一部分脏数据
  console.log("score" + score);
  if (score > 98) {
    return true;
  } else if (score > 95 && goodbytes > 30) {
    return true;
  } else {
    return false;
  }
}

//---------- 程春亮 --结束-----------//

//---------- 方帕思 --开始-----------//
// (6) 获取 工作区 的内容
function getContent() {
  return editor.getValue();
}

// (7) 对 工作区 设置内容
function setContent(content) {
  editor.setValue(content);
}

// (8) 设置语言模式
function setMode(language) {
  editor.session.setMode("ace/mode/" + language);
}

// (9) 设置主题
function setThemes(_theme) {
  editor.setTheme("ace/theme/" + _theme);
}

// (10) 初始化工作区
function initEdittor() {
  editor = ace.edit("editor"); //创建工作区对象
  setContent("--code here--");
  setThemes("cobalt"); //默认主题
  setMode("text"); //默认语言模式为text
  editor.setFontSize(14);
  editor.setShowPrintMargin(false);
  ace.require("ace/ext/language_tools"); //引入language_tools
  //开启代码自动补全功能
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
  });
}
//---------- 方帕思 --结束-----------//

//---------- 朱康希 --开始-----------//
// (11) 自动设置语言模式
function setAutoMode() {
  var language = getFileType(currentFile); //识别文件的扩展名
  setMode(language); //设置语言模式
}

// (12) 识别文件的扩展名
function getFileType(currentFile) {
  var opt = "";
  opt = currentFile.split(".").pop().toLowerCase(); //获取文件的后缀

  switch (opt) {
    case "asm":
      opt = "assembly_x86";
      yuyan.innerHTML = "Assembly_x86"; //设置状态栏
      break;

    case "c":
    case "cpp":
      opt = "c_cpp";
      yuyan.innerHTML = "C/C++"; //设置状态栏
      break;
    case "cs":
      opt = "csharp";
      yuyan.innerHTML = "C#"; //设置状态栏
      break;

    case "css":
      opt = "css";
      yuyan.innerHTML = "CSS"; //设置状态栏
      break;

    case "html":
      opt = "html";
      yuyan.innerHTML = "HTML"; //设置状态栏
      break;

    case "java":
      opt = "java";
      yuyan.innerHTML = "Java"; //设置状态栏
      break;

    case "js":
      opt = "javascript";
      yuyan.innerHTML = "Javascript"; //设置状态栏
      break;

    case "lua":
      opt = "lua";
      yuyan.innerHTML = "Lua"; //设置状态栏
      break;

    case "m":
      opt = "matlab";
      yuyan.innerHTML = "Matlab"; //设置状态栏
      break;

    case "pl":
      opt = "perl";
      yuyan.innerHTML = "Perl"; //设置状态栏
      break;

    case "php":
      opt = "php";
      yuyan.innerHTML = "PHP"; //设置状态栏
      break;

    case "py":
      opt = "python";
      yuyan.innerHTML = "Python"; //设置状态栏
      break;

    case "r":
      opt = "r";
      yuyan.innerHTML = "R"; //设置状态栏
      break;

    case "rs":
      opt = "rust";
      yuyan.innerHTML = "Rust"; //设置状态栏
      break;

    case "sql":
      opt = "sql";
      yuyan.innerHTML = "SQL"; //设置状态栏
      break;

    case "swift":
      opt = "swift";
      yuyan.innerHTML = "Swift"; //设置状态栏
      break;

    case "v":
      opt = "verilog";
      yuyan.innerHTML = "Verilog"; //设置状态栏
      break;
    default:
      opt = "text";
      yuyan.innerHTML = "Text"; //设置状态栏
  }
  return opt; //返回某种语言
}
//---------- 朱康希 --结束-----------//
