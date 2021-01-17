var {
    Menu,
    shell,
    ipcMain,
    BrowserWindow,
    app
} = require('electron');

var template = [{
        label: '文件',
        submenu: [{
                label: '新建',
                accelerator: "Ctrl+N",
                click: function () {
                    //主进程通知渲染进程操作文件
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'new');

                }

            },
            {
                label: '打开',
                accelerator: "Ctrl+O",
                click: function () {

                    //主进程通知渲染进程操作文件
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'open');


                }
            },
            {
                accelerator: "Ctrl+S",
                label: '保存',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'save');

                }
            },
            {
                type: 'separator'
            },

            {
                label: '打印',
                accelerator: "Ctrl+P",
                click: function () {
                    //打印功能通过 webContents  https://electronjs.org/docs/api/web-contents

                    BrowserWindow.getFocusedWindow().webContents.print();


                }
            },
            {
                label: '退出',
                accelerator: "Ctrl+Q",
                role: 'quit'
            }
        ]
    },
    {
        label: '编辑',
        submenu: [

            {
                label: '撤销',
                role: 'undo'
            },
            {
                label: '恢复',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: '剪切',
                role: 'cut'
            },
            {
                label: '复制',
                role: 'copy'
            },
            {
                label: '粘贴',
                role: 'paste'
            },

            {
                label: '删除',
                role: 'delete'
            },
            {
                label: '全选',
                role: 'selectall'
            },

        ]
    },
    {
        label: '视图',
        submenu: [{
                label: '加载',
                role: 'reload'
            },

            {
                label: '缩小',
                role: 'zoomout'
            },
            {
                label: '放大',
                role: 'zoomin'
            },
            {
                label: '重置缩放',
                role: 'resetzoom'
            },
            {
                type: 'separator'
            },
            {
                label: '全屏/取消全屏',
                role: 'togglefullscreen'
            }
        ]
    },
    //-----------方帕思写的代码--2020/5/17---------------//
    {
        label: '语言',
        submenu: [{
                label: 'Assembly',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'assembly_x86');
                }
            },
            {
                label: 'C',
                submenu: [{
                        label: 'C/C++',
                        click: function () {
                            //主进程通知渲染进程设置语言
                            BrowserWindow.getFocusedWindow().webContents.send('action', 'c_cpp');
                        }

                    },
                    {
                        label: 'C#',
                        click: function () {
                            //主进程通知渲染进程设置语言
                            BrowserWindow.getFocusedWindow().webContents.send('action', 'csharp');
                        }
                    },
                    {
                        label: 'CSS',
                        click: function () {
                            //主进程通知渲染进程设置语言
                            BrowserWindow.getFocusedWindow().webContents.send('action', 'css');
                        }
                    }
                ]
            },
            {
                label: 'HTML',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'html');
                }
            },
            {
                label: 'Java',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'java');
                }
            },
            {
                label: 'JavaScript',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'javascript');
                }
            },
            {
                label: 'Lua',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'lua');
                }
            },
            {
                label: 'Matlab',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'matlab');
                }
            },
            {
                label: 'P',
                submenu: [{
                        label: 'Perl',
                        click: function () {
                            //主进程通知渲染进程设置语言
                            BrowserWindow.getFocusedWindow().webContents.send('action', 'perl');
                        }
                    },
                    {
                        label: 'PHP',
                        click: function () {
                            //主进程通知渲染进程设置语言
                            BrowserWindow.getFocusedWindow().webContents.send('action', 'php');
                        }
                    },
                    {
                        label: 'Python',
                        click: function () {
                            //主进程通知渲染进程设置语言
                            BrowserWindow.getFocusedWindow().webContents.send('action', 'python');
                        }
                    }
                ]
            },
            {
                label: 'R',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'r');
                }
            },
            {
                label: 'Rust',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'rust');
                }
            },
            {
                label: 'SQL',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'sql');
                }
            },
            {
                label: 'Swift',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'swift');
                }
            },
            {
                label: 'Verilog',
                click: function () {
                    //主进程通知渲染进程设置语言
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'verilog');
                }
            }
        ]
    },
    {
        label: '主题',
        submenu: [{
                label: 'Cobalt',
                click: function () {
                    //主进程通知渲染进程设置主题
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'cobalt');
                }
            },
            {
                label: 'Eclipse',
                click: function () {
                    //主进程通知渲染进程设置主题
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'eclipse');
                }
            },
            {
                label: 'Monokai',
                click: function () {
                    //主进程通知渲染进程设置主题
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'monokai');
                }
            },
            {
                label: 'Solarized-Dark',
                click: function () {
                    //主进程通知渲染进程设置主题
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'solarized_dark');
                }
            },
            {
                label: 'Solarized_Light',
                click: function () {
                    //主进程通知渲染进程设置主题
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'solarized_light');
                }
            },
            {
                label: 'Vibrant-Ink',
                click: function () {
                    //主进程通知渲染进程设置主题
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'vibrant_ink');
                }
            },
            {
                label: 'Terminal',
                click: function () {
                    //主进程通知渲染进程设置主题
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'terminal');
                }
            }
        ]
    },
    //-------------------方帕思写的代码--已结束-------------------------//


    //==================程春亮==开始================//
    {
        label: '编码',
        submenu: [
            /*{
            label: '使用UTF-8编码查看',
            click: () => {
                BrowserWindow.getFocusedWindow().webContents.send('action', 'utf8');
            }
        }, {
            label: '使用GBK编码查看',
            click: () => {
                BrowserWindow.getFocusedWindow().webContents.send('action', 'gbk');
            }
        },
        {
            type: 'separator'
        },*/
            {
                label: '转为UTF-8编码',
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'changeTo_utf8');
                }
            }, {
                label: '转为GBK编码',
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'changeTo_gbk');
                }
            }
        ]
    },

    //==================程春亮==开始================//
    {
        label: '帮助',
        submenu: [{
            label: '关于',
            click() {

                shell.openExternal('http://www.clcheng.top');

            }
        }]
    }
];
var m = Menu.buildFromTemplate(template);


Menu.setApplicationMenu(m);



//右键菜单


const contextMenuTemplate = [{
        label: '撤销',
        role: 'undo'
    },
    {
        label: '恢复',
        role: 'redo'
    },
    {
        type: 'separator'
    },
    {
        label: '截切',
        role: 'cut'
    },
    {
        label: '复制',
        role: 'copy'
    },
    {
        label: '黏贴',
        role: 'paste'
    },
    {
        type: 'separator'
    }, //分隔线
    {
        label: '全选',
        role: 'selectall'
    } //Select All菜单项
];

var contextMenu = Menu.buildFromTemplate(contextMenuTemplate);


// 监听右键事件
ipcMain.on('contextMenu', function () {

    contextMenu.popup(BrowserWindow.getFocusedWindow());
});



//监听客户端的退出操作
ipcMain.on('exit-app', () => {

    app.quit();
});