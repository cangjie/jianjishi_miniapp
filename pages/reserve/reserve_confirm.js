// pages/reserve/reserve_confirm.js
const app = getApp()
const { VertexBuffer } = require('XrFrame/kanata/lib/index')
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    therapeutist:{ name: '——'},
    showTherapeutist: false,
    payMethod: '微信支付',
    depositCards:[],
    weekCards:[],
    timesCards:[]
  },
  setPayMethod(e){
    var that = this
    that.setData({payMethod: e.detail.value})
  },
  getCards(){
    var that = this
    var product = that.data.product
    var getUrl = app.globalData.requestPrefix + 'Card/GetAllCustomerCards?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var cardList = res.data
        var depositCards = []
        var weekCards = []
        var timesCards = []
        for(var i = 0; i < cardList.length; i++){
          var card = cardList[i]
          if (card.product != null){
            switch(card.product.type){
              case '次卡':
                if (card.timeStatus == '使用期内'){
                  if (card.total_times > card.used_times){
                    for(var j = 0; j < card.associateProdct.length; j++){
                      if (product.id == card.associateProdct[j].id){
                        timesCards.push(card)
                      }
                    }
                  }
                }
                break
              default:
                break
            }
          }
        }
        console.log('card list', cardList)
        that.setData({cardList: cardList, timesCards: timesCards})
      }
    })
  },
  showDetail(){
    var that = this
    that.setData({showTherapeutist: true})
  },

  hideDetail(){
    var that = this
    that.setData({showTherapeutist: false})
  },

  checkUserInfo(){
    var that = this
    var userInfo = that.data.userInfo
    var msg = ''
    if (util.isBlank(userInfo.cell_number) || userInfo.cell_number.length != 11){
      msg = '请填写正确的手机号。'
    }
    else if (util.isBlank(userInfo.real_name)){
      msg = '请填写姓名。'
    }
    else if (userInfo.gender != '男' && userInfo.gender != '女'){
      msg = '请选择性别。'
    }
    if (msg != ''){
      wx.showToast({
        title: msg,
        icon: 'error'
      })
      return false
    }
    else{
      return true
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    var shopId = options.shopId
    var productId = options.productId
    var date = options.date
    var selectedId = options.selectedId
    that.setData({shopId: shopId, productId: productId, date: date, selectedId: selectedId})
    var getUrl = app.globalData.requestPrefix + 'Shop/GetSingleShop/' + shopId.toString()
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        that.setData({shop: res.data})
      }
    })
    getUrl = app.globalData.requestPrefix + 'Product/GetSingleProduct/' + productId.toString()
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var product = res.data
        product.sale_priceStr = util.showAmount(product.sale_price)
        that.setData({product: product})
        that.getCards()
        if (product.need_therapeutist == 1){
          getUrl = app.globalData.requestPrefix + 'Reserve/GetTherapeutistTime/' + that.data.selectedId
          wx.request({
            url: getUrl,
            method: 'GET',
            success:(res)=>{
              if (res.statusCode != 200){
                return
              }
              that.setData({timeTableItem: res.data.shopTimeTable, therapeutist: res.data.therapeutist, therapeutistTimeItem: res.data})
            }
          })
        }
        else{
          getUrl = app.globalData.requestPrefix + 'Reserve/GetTimeTableItem/' + that.data.selectedId
          wx.request({
            url: getUrl,
            method: 'GET',
            success:(res)=>{
              if (res.statusCode != 200){
                return
              }
              that.setData({timeTableItem: res.data})
            }
          })
        }
      }
    })
  },

  reserve(){
    
    var therapeutistTimeId = 0
    var that = this

    if (!that.checkUserInfo()){
      return
    }
    var userInfo = that.data.userInfo
    if (userInfo.mod){
      var modUrl = app.globalData.requestPrefix + 'MiniUser/ModUserInfo?cell=' + userInfo.cell_number + '&name=' + encodeURIComponent(userInfo.real_name) + '&gender=' + encodeURIComponent(userInfo.gender) + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
      wx.request({
        url: modUrl,
        method: 'GET',
      })
    }


    if (that.data.therapeutistTimeItem != undefined){
      therapeutistTimeId = that.data.therapeutistTimeItem.id
    }
    var timeTableId = that.data.timeTableItem.id

    var payMethod = that.data.payMethod

    var cardId = 0

    switch(payMethod){
      case '次卡':
        var timesCards = that.data.timesCards
        cardId = timesCards[0].id
        break
      case '储值卡':
        var depositCards = that.data.depositCards
        cardId = depositCards[0].id
        break
      case '季卡':
        var weekCards = that.data.weekCards
        cardId = weekCards[0].id
        break
      default:
        break
    }


    var reserveUrl = app.globalData.requestPrefix + 'Reserve/Reserve/' + that.data.product.id + '?timeId=' + timeTableId.toString() + '&therapeutistTimeId=' + therapeutistTimeId.toString() + '&date=' + encodeURIComponent(that.data.date) 
    + '&cardId=' + cardId + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: reserveUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          wx.showToast({
            title: '预约失败',
            icon: 'error'
          })
        }
        else{

          
          var reserve = res.data
          
          that.setData({reserve: reserve})

          var msg = ''
          switch(payMethod){
            case '次卡支付':
              break
            default:
              msg = '预约成功，请尽快支付！'
              that.payOrder()
              break
          }

          wx.showToast({
            title: msg,
            icon: 'success'
          })



          


          
        }
      }
    })
  },

  payOrder(){
    var that = this
    var orderId = that.data.reserve.order.id
    var payUrl = app.globalData.requestPrefix + 'Order/PayOrder/' + orderId + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: payUrl,
      method: 'GET',
      success:(res)=>{
        console.log('ready to pay', res)
        if (res.statusCode != 200){
          return
        }
        var nonce = res.data.nonce
        var prepay_id = res.data.prepay_id
        var sign = res.data.sign
        var timeStamp = res.data.timeStamp
        wx.requestPayment({
          nonceStr: nonce,
          package: 'prepay_id=' + prepay_id,
          paySign: sign,
          timeStamp: timeStamp,
          signType: 'RSA',
          success:(res)=>{
            console.log('pay suc', res)
            wx.redirectTo({
              url: '../mine/reserve_list',
            })
          }
        })
      }
    })
  },

  modUserInfo(e){
    console.log('mod user info', e)
    var that = this
    var id = e.currentTarget.id
    var value = e.detail.value
    var userInfo = that.data.userInfo
    switch(id){
      case 'name':
        userInfo.real_name = value
        userInfo.mod = true
        break
      case 'cell':
        
        if (value.length == 11){
          userInfo.cell_number = value
          userInfo.mod = true
        }
        break
      case 'gender':
        userInfo.gender = value
        userInfo.mod = true
        break
      default:
        break
    }
  },
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
        var newUserInfo = res.data
        var userInfo = that.data.userInfo
        userInfo.cell_number = newUserInfo.cell_number
        userInfo.cell_numberPlaceHolder = newUserInfo.cell_number
        that.setData({userInfo: userInfo})
        //that.setData({show: false})
        //that.triggerEvent("UpdateSuccess", {userInfo: res.data})
      }
    })

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
    app.loginPromise.then(function(resolve){
      
      var userInfo = app.globalData.userInfo
      if (util.isBlank(userInfo.cell_number)){
        userInfo.cell_numberPlaceHolder = '请填写手机号。'
      }
      else{
        userInfo.cell_numberPlaceHolder = userInfo.cell_number
      }
      if (util.isBlank(userInfo.real_name)){
        userInfo.real_namePlaceHolder = '请填写姓名。'
      }
      else {
        userInfo.real_namePlaceHolder = userInfo.real_name
      }
      userInfo.mod = false
      that.setData({userInfo: userInfo})
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