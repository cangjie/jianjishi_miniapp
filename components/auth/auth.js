// pages/components/auth/auth.js
const app = getApp()
Component({
  /**
   * Component properties
   */
  properties: {
    validType: {
      type: String,
      value: "info"
    }
  },

  /**
   * Component initial data
   */
  data: {
    title: '需要获取您的头像、昵称和性别',
    show: true,
    validType: 'cell'
  },
  ready: function(){
    var that = this
    switch(that.properties.validType.trim()){
      case 'cell':
        that.setData({title: '需要获取您的手机号。'})
        break
      case 'info':
        that.setData({title: '需要获取您的头像、昵称等信息。'})
        break
      default:
        break
    }
  },
  /**
   * Component methods
   */
  methods: {
    getPhoneNumber: function(res) {
      var that = this
      console.log('phone number getted', res)
      var postData = res.detail
      postData.sessionKey = app.globalData.sessionKey
      var savePhoneNumberUrl = app.globalData.requestPrefix + 'MiniUser/UpdateCellNumber'
      wx.request({
        url: savePhoneNumberUrl,
        method: 'POST',
        data: postData,
        success: (res) =>{
          console.log('phone number decrypted', res)
          that.setData({show: false})
          that.triggerEvent("UpdateSuccess", {userInfo: res.data})
        }
      })

    }
  }
})
