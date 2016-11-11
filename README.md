# regularTool
正则表达式工具    
一：输入文本，输入正则表达式，同步给出匹配结果和匹配的多个组  
二：输入替换的表达式，替换路径下的相应文件的正则表达式匹配部分  
  
说明：支持回车和其他情况匹配，仅支持正向断言和正向否定断言
  
表达式格式：  
  比如hellow world替换成hello world I am L-chao  
   - 正则表达式是：hellow (world)  
   - 替换表达式是：hellow $1 I am L-chao  
  也可以  
   - 正则表达式是：(hellow )(world)  
   - 替换表达式是：$1$2 I am L-chao  
  
内部使用的是js的String.replace函数，参照此函数解释即可  
[replace教程](http://www.w3school.com.cn/jsref/jsref_replace.asp)  
  
  
[软件打包好的exe文件](http://pan.baidu.com/s/1skC7Ym5)  
  
请确保安装了node和npm  
项目下载后执行
```
npm install
```
另外需要安装sass(如果不更改css就不需要sass)和全局安装electron-prebuilt  
```
npm install electron-prebuilt
```
sass安装请看[sass中文网](http://www.w3cplus.com/sassguide/install.html)  
sass编译scss使用的是grunt，前面的install命令已经安装，执行以下命令即可编译scss文件夹到app/css文件夹
```
npm install -g grunt
gurnt
```

运行项目
```
electron .
``` 

打包需要根目录下执行以下命令,打包时间需要下载，时间较长  
```
npm run build
```
******
## -------欢迎大家 fork，star 和 push