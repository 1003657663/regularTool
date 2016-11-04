# regularTool
正则表达式工具    
一：输入文本，输入正则表达式，同步给出匹配结果和匹配的多个组  
二：输入替换的表达式，替换路径下的相应文件的正则表达式匹配部分  

表达式格式：  
  比如hellow world替换成hello world I am L-chao  
    正则表达式是：hellow (world)  
    替换表达式是：hellow $1 I am L-chao  
  也可以  
    正则表达式是：(hellow )(world)  
    替换表达式是：$1$2 I am L-chao  
  
内部使用的是js的String.replace函数，参照此函数解释即可
