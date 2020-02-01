const path = require('path');
const hardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = env => {
  return {
    // node.js で動作することを指定する
    target: 'electron-renderer',
    // 起点となるファイル
    entry: './src/EntryPoint.tsx',
    // webpack watch したときに差分ビルドができる
    cache: true,
    // development は、 source map file を作成、再ビルド時間の短縮などの設定となる
    // production は、コードの圧縮やモジュールの最適化が行われる設定となる
    mode: env.prod ? 'production' : 'development',
    // ソースマップのタイプ
    devtool: env.prod ?  '' : 'source-map',
    // 出力先設定 __dirname は node でのカレントディレクトリのパスが格納される変数
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'index.js'
    },
    // ファイルタイプ毎の処理を記述する
    module: {
        rules: [{
                // 正規表現で指定する
                // 拡張子 .ts または .tsx の場合
                test: /\.tsx?$/,
                // ローダーの指定
                // TypeScript をコンパイルする
                use: 'ts-loader'
            },
            {
                // 拡張子 .ts または .tsx の場合
                test: /\.tsx?$/,
                // 事前処理
                enforce: 'pre',
                // TypeScript をコードチェックする
                loader: 'tslint-loader',
                // 定義ファイル
                options: {
                    configFile: './tslint.json',
                    // airbnb というJavaScriptスタイルガイドに従うには下記が必要
                    typeCheck: true,
                },
            },
            {
              test: /\.worker\.js$/,
              use: { loader: 'worker-loader' }
            },
            {
                // node_modules 以下の css は元のクラス名でロード
                test: /node_modules\/.*\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
            {
                // src 以下の css は名前衝突回避されたクラス名でロード
                test: /src\/.*\.css$/,
                loaders: ['thread-loader', 'style-loader', 'css-loader?modules'],
            },
        ],
    },
    // 処理対象のファイルを記載する
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js', // node_modulesのライブラリ読み込みに必要
        ],
        alias: {
            "src": path.resolve('./src')
        }
    },
    // プラグイン設定
    plugins: [
      new hardSourceWebpackPlugin()
    ]
  }
};
