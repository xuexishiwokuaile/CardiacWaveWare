/// 文 件 名：jquery.dataTables.whu.plugin
/// 描    述：开发针对相应的dataTables相应的jquery应用的插件
/// 项目名称：cardiac
/// 作    者：武汉大学国家网络安全学院@沈家强
/// 发布日期：2019/2/18  23:13
/// 文件版本：V1.0
/// 注意：本内容仅限于武汉大学国家网络安全学院陈刚教授团队内部传阅，禁止外泄以及用于其他的商业目
/// @Copyright: 2019 www.whu.edu.cn. All rights reserved.
/// All rights Reserved, Designed By www.whu.edu.cn

(function($){

  $.request = function(url, outParam={}, type="GET", dataType="json"){
    return new Promise((resolve, reject) => {
      //相应的ajax方案
      $.ajax({
        url: url,
        type: type,
        cache: false, //禁用缓存
        data: outParam, //传入组装的参数
        dataType: dataType,
        success: res=>{
          resolve(res);
        },
        fail: error=>{
          reject(error);
        }
      });
    });
  }
})(jQuery)
