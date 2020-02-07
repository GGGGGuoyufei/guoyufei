const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
    // 引入等比适配插件
    // const px2rem = require('postcss-px2rem')

// // 配置基本大小
// const postcss = px2rem({
//     // 基准大小 baseSize，需要和rem.js中相同
//     remUnit: 100
// })
module.exports = {
    //runtimeCompiler: true,
    publicPath: './', // 设置打包文件相对路径
    outputDir: 'dist',
    assetsDir: 'static',
    devServer: {
        // open: process.platform === 'darwin',
        host: 'localhost',
        port: 8075,
        open: true, //配置自动启动浏览器
        proxy: {
            '/cmp': {
                // target: 'http://192.168.100.58:6062',
                // target: 'http://192.168.100.148:6062',
                //target: 'http://10.152.240.107:6062',//服务器 
                target:'http://172.26.28.118:6062',
                // target: 'http://localhost:6062',//打包
                // target:'http://10.152.240.110:6068',
                // target:'http://10.152.240.110:6088',//老白基础监控
                // target:'http://192.168.100.91:8800',//老白应用监控
                // target:'http://192.168.100.91:8080',
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/cmp': '',
                }
            }
        }
    },
    lintOnSave: true,
    // css: {
    //     loaderOptions: {
    //         postcss: {
    //             plugins: [
    //                 postcss
    //             ]
    //         }
    //     }
    // }
    configureWebpack: {
        plugins: [
            new MonacoWebpackPlugin()
        ]
    }
}