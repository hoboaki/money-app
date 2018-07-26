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
    datepicker();

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
    function activatePage(aId)
    {
        // 現在表示しているページを非アクティブに。
        if (activePageKey != null) {
            $(`#page${activePageKey}`).removeClass('page-active');
            activePageKey = null;
        }

        // ページをアクティブ化
        activePageKey = aId;
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
}

