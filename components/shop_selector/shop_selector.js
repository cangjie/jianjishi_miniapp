// components/shop_selector/shop_selector.js
const app = getApp()
Component({
  /**
   * Component properties
   */
  properties: {
    shopId: {
      type: Number,
      value: 0
    }
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
            var currentSeletctIndex = 0
            for(var i = 0; i < res.data.length; i++){
              name_list.push(res.data[i].name)
              id_list.push(res.data[i].id)
              if (currentSeletctIndex == 0 && that.properties.shopId == res.data[i].id){
                currentSeletctIndex = i
                that.setData({currentSelectedIndex: currentSeletctIndex + 1})
              }
            }
            that.setData({shop_list: res.data, name_list: name_list, id_list: id_list})
            var shop = ''
            var shopId = 0
            if (that.data.currentSelectedIndex > 0){
              shop = that.data.shop_list[that.data.currentSelectedIndex - 1].name
              shopId = that.data.shop_list[that.data.currentSelectedIndex - 1].id
            }
            that.triggerEvent('ShopSelected', {shop: shop, shopId: shopId, shopList: that.data.shop_list})
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
