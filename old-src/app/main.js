window.onload = function() {
    // require
    const $ = require('jquery');
    const Grid = require('editable-grid');
    const remote = require('electron').remote;
    const {ipcRenderer} = require('electron');
    const Menu = remote.Menu;
    const MenuItem = remote.MenuItem;
    const formatters = require('./external/editable-grid/formatters');    
    const datepicker = require('date-selector');
    const Split = require('split.js')
    const Model = require('./model.js');
    const SampleDoc = require('./sample-doc.js');
    datepicker();

    // テスト実行
    window.setTimeout(function(){SampleDoc.Test();}, 2000); // 接続してからテストして欲しいので一定時間待つ。

    // ドキュメント用意    
    var doc = new SampleDoc.Create();

    // コールバック登録
    ipcRenderer.on('app-message', (event, msg) => {
        switch (msg) {
            case 'focus':
                $('#titleBar').addClass("title-bar-bg-active");
                break;
                
            case 'blur':
                $('#titleBar').removeClass("title-bar-bg-active");
                break;
        }
    });

    // ページ切替
    let activePageKey = null;
    function activatePage(aId) {
        // 現在表示しているページを非アクティブに。
        if (activePageKey != null) {
            $(`#page${activePageKey}`).removeClass('page-active');
            $(`#sidebarBtn${activePageKey}`).removeClass('sidebar-btn-active');
            activePageKey = null;
        }

        // ページをアクティブ化
        activePageKey = aId;
        $(`#sidebarBtn${activePageKey}`).addClass('sidebar-btn-active');
        $(`#page${activePageKey}`).addClass('page-active');
    }

    // サイドナビボタンに機能を登録
    $('#sidebarBtnSheet').click(function(){
        activatePage('Sheet');
    });
    $('#sidebarBtnFind').click(function(){
        activatePage('Find');
    });
    $('#sidebarBtnAccount').click(function(){
        activatePage('Account');
    });

    // 初期ページ表示
    activatePage('Sheet');

    // スプリッター設定
    Split(['#pageSheetBodyTop', '#pageSheetBodyBottom'], {
        sizes: [25, 75],
        minSize: 200,
        gutterSize: 8,
        direction: 'vertical',
        elementStyle: function (dimension, size, gutterSize) {
            let reservedHeight = 44; // タイトルバー + ヘッダーエリア
            return {
                'height': `calc(${size}% - ${gutterSize}px - ${reservedHeight}px)`
            }
        }
    });
}

