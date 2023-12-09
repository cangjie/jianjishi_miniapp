// pages/therapeutist/therapeutist_list.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {

  },

  jump(e){
    var id = e.currentTarget.id
    wx.navigateTo({
      url: 'therapeutist?id=' + id,
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    var that = this
    var getUrl = app.globalData.requestPrefix + 'Shop/GetTherapeutists'
    wx.request({
      url: getUrl,
      method:'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var therapeutistList = res.data
        for(var i = 0; i < therapeutistList.length; i++){
          var desc = therapeutistList[i].desc
          desc = desc.replace(/\r\n/g, '<br/>')
          console.log('desc', desc)
          therapeutistList[i].desc = desc
        }
        that.setData({therapeutistList: therapeutistList})
        
      }
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})