// 云函数入口文件
const cloud = require('wx-server-sdk')

const extCi = require("@cloudbase/extension-ci");
const tcb = require("tcb-admin-node");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
tcb.init({
  env: "my-env-id"
});
tcb.registerExtension(extCi);  

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('====================')
  try {
    const res = await tcb.invokeExtension("CloudInfinite", {
      action: "DetectLabel",
      cloudPath: event.path // 需要分析的图像的绝对路径，与tcb.uploadFile中一致
    });
    console.log(JSON.stringify(res.data, null, 4));
    return res.data;
  } catch (err) {
    console.log(JSON.stringify(err, null, 4));
  }
}