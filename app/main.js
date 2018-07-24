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
}

