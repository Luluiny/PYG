 $(function(){
     //查询参数
     var QueryObj={
         query:"",
         cid:getValue("cid"),
         pagenum:1,
         pagesize:6
     };
     //总页数
     var totalPage=1;
     init();
     function init(){
        mui.init({
            pullRefresh: {
              container: ".view",
              down: {
                auto: true,
                //  触发下拉刷新时自动触发
                callback: function () {
                    //页面一开始就刷新同时发勇请求 然后数据回来之后结束下拉刷新
                    $(".view ul").html("");
                    QueryObj.pagenum=1;
                    //重置上拉刷新组件
                    search(function(){
                        mui('.view').pullRefresh().endPulldownToRefresh();
                        // 重置 上拉组件
                        mui('.view').pullRefresh().refresh(true);
                    });
                }
              },
              up:{
                //  触发上拉刷新时自动触发
                callback:function () {
                    //要判断还有没有下一页  有就QueryObj.pagenum++；
                    // 没有下一页就不需要执行
                    //计算总页数   当前页数和总页数做判断
                    if(QueryObj.pagenum>=totalPage){
                        console.log("没有更多数据了 不在执行");
                        //结束上拉加载更多  如果没有数据 传入true 否则传入false 
                        mui('.view').pullRefresh().endPullupToRefresh(true);
                        return;
                    } else{
                        QueryObj.pagenum++;
                        search(function(){
                            mui('.view').pullRefresh().endPullupToRefresh();
                        });
                    }
                }
              }
            }
          });
     }
    
    
     //根据 url上的key来获取值
     function getValue(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
     }

      
      //获取数据列表
      //callback是为了自定义决定下拉还是上拉
      function search(callback){
        $.get("goods/search",QueryObj,function(ret){
            //总页数
            totalPage=Math.ceil(ret.data.total/QueryObj.pagesize);
            var html=template("mainTpl",{arr:ret.data.goods});
            //为了加载下一页 不断地去append追加
            $(".view ul").append(html);
            callback&&callback();
        })
      }
 })