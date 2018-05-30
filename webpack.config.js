require("babel-polyfill")
require("raw-loader")

module.exports = {
    entry: ['./src/index.js'],
    output: {
        filename: './index.js'
    },
    module: {
        rules: [
            { 
                test: [/\.js$/, /\.jsx$/], 
                exclude: /node_modules/, 
                loader: "babel-loader" ,
                query: {
                    presets: ["env"],
                    plugins: [
                        "transform-decorators-legacy",
                        "transform-decorators",
                        "transform-custom-element-classes",
                        ["transform-class-properties", {"loose": true}],
                        "transform-es2015-classes",
                        "transform-object-rest-spread",
                        ["transform-react-jsx", { "pragma":"h" }],
                        
                    ]
                }
            },
            {
                test: [/\.html$/, /\.css$/],
                use: 'raw-loader'
            }
        ]
    }
}