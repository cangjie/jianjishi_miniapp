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
            var id_list = [0]
            for(var i = 0; i < res.data.length; i++){
              name_list.push(res.data[i].name)
              id_list.push(res.data[i].id)
            }
            that.setData({shop_list: res.data, name_list: name_list, id_list: id_list})
            that.triggerEvent('ShopSelected', {shop: '', shopId: 0, shopList: that.data.shop_list})
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
        that.triggerEvent('ShopSelected', {shop: '', shopId: 0, shopList: that.data.data.shop_list})
      }
      else{
        var selectedShopName = that.data.name_list[e.detail.value]
        var selectedShopId = that.data.id_list[e.detail.value]
        that.triggerEvent('ShopSelected', {shop: selectedShopName, shopId: selectedShopId, shopList: that.data.shop_list})
      }
      
    }
  }
})
