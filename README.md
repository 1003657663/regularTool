# regularTool
正则表达式工具    
一：输入文本，输入正则表达式，同步给出匹配结果和匹配的多个组  
二：输入替换的表达式，替换路径下的相应文件的正则表达式匹配部分  
  
说明：支持回车和其他情况匹配，仅支持正向断言和正向否定断言
  
表达式格式：  
  比如hellow world替换成hello world I am L-chao  
    正则表达式是：hellow (world)  
    替换表达式是：hellow $1 I am L-chao  
  也可以  
    正则表达式是：(hellow )(world)  
    替换表达式是：$1$2 I am L-chao  
  
内部使用的是js的String.replace函数，参照此函数解释即可  
[replace教程](http://www.w3school.com.cn/jsref/jsref_replace.asp)  
  
  
[软件打包好的exe文件](http://pan.baidu.com/s/1skC7Ym5)  
  
请确保安装了node和npm，项目下载后执行npm install按装依赖文件  
另外需要安装sass和全局安装electron-prebuilt
执行electron .或者npm run start运行项目
