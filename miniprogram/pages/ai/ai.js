// miniprogram/pages/ai.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBoder:'item-img-boder',
    imgUrl:'../../images/ai/default.png',
    recognitionResult:{},
    pornInfo:"",
    adsInfo:"",
    imgResult:[],
    isResult:false,
    errDesc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  chooseImage(){
    const that=this
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const startTime = new Date().getTime();
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            wx.cloud.callFunction({
              name: "ai",
              data: {
                "path": cloudPath
              },
              success(res) {
                // console.log('----', res.result.RecognitionResult)
                if (res.result.RecognitionResult==null){
                  return
                }
                const politicsInfo = res.result.RecognitionResult.PoliticsInfo;
                const pornInfo = res.result.RecognitionResult.PornInfo;
                const terroristInfo=res.result.RecognitionResult.TerroristInfo;
                if (politicsInfo.HitFlag > 0 || pornInfo.HitFlag > 0 || terroristInfo.HitFlag>0){
                  that.setData({
                    errDesc:'图片涉嫌违禁，请重新选择图片',
                    isResult:true
                  })
                  
                  return
                }
                that.setData({
                  imgUrl: filePath,
                  recognitionResult: res.result.RecognitionResult,
                  pornInfo: JSON.stringify(res.result.RecognitionResult.PornInfo, null, 4),
                  imgBoder:'item-img'
                })

                wx.cloud.callFunction({
                  name: "aiImgLabel",
                  data: {
                    "path": cloudPath
                  },
                  success(res){
                    console.log('----', res.result)
                    that.setData({
                      imgResult: res.result.RecognitionResult.Labels,
                      isResult:false
                    })
                    const endTime = new Date().getTime();
                    console.log('本次耗时:%s秒',(endTime-startTime)/1000)
                  },
                  fail(e){
                    console.log('1111111111------',e)
                  }
                })
              }
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
        
      },
    })
  },
})