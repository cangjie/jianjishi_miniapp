// components/shop_selector/shop_selector.js
const app = getApp()
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    currentSelectedIndex: 0
  },
  lifetimes:{
    ready: function(){
      var that = this
      app.loginPromise.then(function(resolve){
        var url = app.globalData.requestPrefix + 'Shop/GetShop'
        wx.request({
          url: url,
          method: 'GET',
          success:(res)=>{
            console.log('get shop list:', res)
            var name_list = ['选择店铺...']
            for(var i = 0; i < res.data.length; i++){
              name_list.push(res.data[i].name)
            }
            that.setData({shop_list: res.data, name_list: name_list})
            that.triggerEvent('ShopSelected', {shop: ''})
          }
        })
      })
    }
  },
  /**
   * Component methods
   */
  methods: {
    selectChanged:function(e){
      console.log('shop select changed:', e)
      var that = this
      that.setData({currentSelectedIndex: e.detail.value})
      if (e.detail.value == 0){
        that.triggerEvent('ShopSelected', {shop: ''})
      }
      else{
        var selectedShopName = that.data.name_list[e.detail.value]
        that.triggerEvent('ShopSelected', {shop: selectedShopName})
      }
      
    }
  }
})
