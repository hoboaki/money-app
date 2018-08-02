let Model = require('./model.js');

module.exports = {
    Create: function() {
        let doc = new Model.Doc();
        doc.accountAdd("財布", Model.AccountKind.AssetsCash, 2020);       
        doc.accountAdd("アデリー銀行", Model.AccountKind.AssetsBank, 504000);
        doc.accountAdd("コウテイ銀行", Model.AccountKind.AssetsBank, 12036756);
        doc.accountAdd("PPPカード", Model.AccountKind.LiabilitiesCard, 0);
        doc.accountAdd("キングカード", Model.AccountKind.LiabilitiesCard, 0);
        
        // test
        if (true) {
            console.log(JSON.stringify(doc));
            let dupDoc = new Model.Doc();
            let data = doc.exportData();
            console.log(data);
            dupDoc.importData(data);
            console.log(JSON.stringify(doc));
        }

        return doc;
    },
};
