// 專案發佈時需要用到的插件
const prodPlugins = []

if (process.env.NODE_ENV === 'build') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
