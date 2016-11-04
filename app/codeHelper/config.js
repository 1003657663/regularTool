exports.config = {
    isTest: false,
    filterFile: [
        'internetrecords.htm'
    ],
    filterDir: [
        'js', 'css', 'easyui', 'images'
    ],
    findPath: "C:\\Users\\chao\\Desktop\\SECScanTiptopOtp_M_Beta_20161023145251\\html\\form",//路径
    findReg: /(class=\"table-page-bar\">)[\s\S]*?(<a.*?onclick=\"ReadPrevPageRecords\((.*?)\).*?上一页<\/a>)([\s\S]*?)(readonly)([\s\S]*?页<\/span>)([\s\S]*?下一页<\/a>)([\s\S]*?<\/div>)/mg,//通过reg从整体中取得要操作的部分
    replaceReg: "$1\r\n" +
    "<a href=\"javascript:void(0);\" class=\"btn btn-primary-middle\" " +
    "onclick=\"ReadPageRecords($3,0)\">首页</a>" +
    "$2$4$6\r\n" +
    "<a href=\"javascript:void(0);\" class=\"btn btn-primary-middle\" " +
    "onclick=\"ReadPageRecords($3)\">跳转</a>" +
    "$7\r\n" +
    "<a href=\"javascript:void(0);\" class=\"btn btn-primary-middle\" "
    + "onclick=\"ReadPageRecords($3,-1)\">尾页</a>" +
    "$8\r\n",
}