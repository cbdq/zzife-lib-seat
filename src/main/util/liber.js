<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge"/>
    <title>郑州财经学院座位管理系统</title>
    <!-- Bootstrap -->
    <link href="/Public/newweb/Content/vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!--[if lte IE 6]>
    <link rel="stylesheet" type="text/css" href="/Public/newweb/Content/vendors/bootstrap/dist/css/bootstrap-ie6.css">
    <![endif]-->
    <!--[if lte IE 7]>
    <link rel="stylesheet" type="text/css" href="/Public/newweb/Content/vendors/bootstrap/dist/css/ie.css">
    <![endif]-->
    <!-- Font Awesome -->
    <link href="/Public/newweb/Content/vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- Custom Theme Style -->
    <link href="/Public/newweb/Content/build/css/custom.min.css" rel="stylesheet">
    <link href="/Public/newweb/Content/style.css" rel="stylesheet" type="text/css" />
    <link href="/Public/newweb/Content/ske/css/web.css" rel="stylesheet" />
    <!--jquery-->
    <script src="/Public/newweb/Content/vendors/jquery/dist/jquery.min.js"></script>
    <!-- 弹窗 -->
    <link href="/Public/newweb/Content/vendors/artDialog/css/ui-dialog.css" rel="stylesheet" />
    <link href="/Public/newweb/Content/vendors/artDialog/theme/green/css/web-green-dialog.css" rel="stylesheet" />
    <script src="/Public/newweb/Content/vendors/artDialog/dist/dialog.js"></script>
    <!-- 自定义 弹窗扩展 效果 -->
    <script src="/Public/newweb/Content/vendors/artDialog/ext/ext.js"></script>
    <!-- Bootstrap -->
    <script src="/Public/newweb/Content/vendors/bootstrap/dist/js/bootstrap.min.js"></script>
    <!--框架样式-->
    <link href="/Public/newweb/Content/ske/css/frame.css" rel="stylesheet" type="text/css" />
    <!--固定顶部-->
    <script src="/Public/newweb/Content/vendors/stickUp/stickUp.min.js"></script>
    <!--放大缩小插件-->
    <script src="/Public/static/jquery-panzoom/dist/panzoom.js"></script>

    <!-- 自定义js -->
    <script src="/Public/newweb/Content/ske/distribute/common.js"></script>
    <link href="/Public/newweb/Content/ske/css/globe.css" rel="stylesheet" type="text/css" />
    <!-- Canvas 插件 -->
    <!--Step:1 Import a module loader, such as esl.js or require.js-->
    <!--Step:1 引入一个模块加载器，如esl.js或者require.js-->
    <script src="/Public/newweb/Content/vendors/zrender/esl.js"></script>
    <script data-require-id="zrender" src="/Public/newweb/Content/vendors/zrender/zrender.js" async=""></script>
    <script data-require-id="zrender/shape/Polygon" src="/Public/newweb/Content/vendors/zrender/zrender.js" async=""></script>
    <style type="text/css">
        .back-icon{
    		position: absolute;
    		left:1128px;
    		top:552px;
			z-index: 10;
			width: 237px;
			height:213px;
			display: block;
    	}
        #floor {
		    background: url(/Public/home/images/web/area/1/floor.jpg) 0 0 no-repeat;
			position: relative;
		}
        .pswreset{display:none!important;}
    </style>
</head>
<body>
<div style="position:absolute; right:10px; top:5px; z-index:1000;">
		<a id="language" class="btn btn-warning">中文</a>
	</div>
    <!--大屏幕-->
    <div class="top visible-md visible-lg" style="text-align:center;">
        <div class="col-xs-12 col-sm-9 top_title">
            <div class="left systitle">
                <span class="title">郑州财经学院座位管理系统</span><br />
				                <span class="min_title">The library space reservation system</span>
            </div>
            <ul class="menu">
                <li><a href="/home/web/index">首页</a></li>
                <li class="active"><a href="/home/web/f_second">空间预约</a></li>
                                <li><a href="javascript:void(0);"  onclick="bookRule(ska.bookRule);">预约规则</a></li>
                <li class="login-control">
                    <a class="login-btn login_click" href="javascript:void(0);">登录</a>
                </li>
                <li class="renege" style="display:none;"><a href="/web/renege"></a></li>
                <li class="logout-control" style="display:none;">
                <a class="login-welcome" href="/user/index/index/from/index"  target="_blank" >我的中心</a>
                欢迎                <a class="logout-btn" href="javascript:void(0);">退出登录</a></li>
            </ul>
        </div>
        <div class="clearfix"></div>
    </div>
    <!--移动端-->
    <div class="top visible-xs visible-sm top_nav" style="text-align:center; height:auto;">
        <div class="col-xs-12 col-sm-9 top_title nav_menu">
            <div class="left systitle">
                <span class="title2">郑州财经学院座位管理系统</span><br />
				                <span class="min_title">The library space reservation system</span>
            </div>
            <ul class="col-xs-12 mobile_menu">
                <li><a href="/home/web/index">首页</a></li>
                <li class="active"><a href="/home/web/f_second">空间预约</a></li>
				<!--<li><a href="/home/book/index">入馆预约</a></li>-->
                                <li><a href="javascript:void(0);"  onclick="bookRule(ska.bookRule);">预约规则</a></li>
                <li class="renege" style="display:none;"><a href="/web/renege"></a></li>
                <li class="logout-control" style="display:none;"><a class="login-welcome" href="/user/index/index/from/index"  target="_blank" >我的中心</a></li>
                <li class="login-control">
                    <a href="javascript:;" class="user-profile dropdown-toggle login-btn login_click" data-toggle="dropdown" aria-expanded="false">
                    登录                    </a>
                </li>
                <li class="logout-control" style=" display:none">
					欢迎                    <a href="javascript:;" class="user-profile dropdown-toggle logout-btn" data-toggle="dropdown" aria-expanded="false">
                     退出登录                    </a>
                </li>
            </ul>
        </div>
        <div class="clearfix"></div>
    </div>

    <!--手机操作菜单-->
    <div class="navbar navbar-default phone_menu col-xs-12 visible-xs visible-sm" role="navigation" style="text-align:center; z-index:999; clear:both;  float: none;">
        <div class="container-fluid">
            <ul class="nav navbar-nav" style="width: 300px; margin: 0 auto; float: none;">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">校区选择<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li role="separator" class="divider"></li>
                            <li class=""><a href="/home/web/seat/area/1">图书馆</a></li>

                        <li role="separator" class="divider"></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">日期选择<b class="caret"></b></a>
                    <ul class="dropdown-menu" id="areadays_phone">

                    </ul>
                </li>
            </ul>
        </div>
    </div>
    <!--手机操作菜单-->

    <!--图书馆校区列表-->
    <div class="col-xs-12 col-sm-9 xiaoqutitle">
        <div class="col-xs-12" style="text-align:center; float:none; margin:0 auto; background-color:#F3F3F3;">
            <h1 style="font-size:34px; color:#eb1d50;">您正在预定【<span id="yuyuetime"></span>】<span id="libraryname"></span>座位</h1>
                    </div>
        <div id="wizard" class="form_wizard wizard_horizontal hidden-xs hidden-sm" style="margin-top:10px;">
            <ul class="wizard_steps anchor">
                <li>
                    <a class="selected" isdone="1" rel="1">
                        <span class="step_no">1</span>
                        <span class="step_descr">选择楼层</span>
                    </a>
                </li>
                <li>
                    <a class="disabled" isdone="0" rel="2">
                        <span class="step_no">2</span>
                        <span class="step_descr">选择区域和日期</span>
                    </a>
                </li>
                <li>
                    <a class="disabled" isdone="0" rel="3">
                        <span class="step_no">3</span>
                        <span class="step_descr">选择座位</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div class="col-xs-12 col-sm-9 xiaoqu" style=" padding:0px;">
        <div class="x_panel" style="border:0; background:none; padding:0px">
            <div class="col-xs-12" id="content" style="height:560px; position:relative; text-align:center; overflow:hidden; padding:0px;">
                <!--Step:2 Prepare a dom for ZRender which (must) has size (width & hight)-->
                <!--Step:2 为ZRender准备一个具备大小（宽高）的Dom-->
                <div id="floor" style="width:1920px; height:1080px; margin:0;">

                </div>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
    </div>
    <!--底部信息-->
    <div class="foots col-xs-12">
        <div class="col-xs-12">Copyright © 2019.Company SKA All rights reserved. </div>
    </div>

    <!--大屏幕左右侧菜单-->
    <div id="nav" class="visible-md visible-lg">
        <div id="nav-date" class="left"></div>
    </div>
    <!--大屏幕左右侧菜单-->
    <div id="changeplace" class="visible-md visible-lg">
        <!--入馆预约切换按钮-->
        <a id="rgyy" type="button" href="/home/book/index" class="btn btn-info" style="padding:10px 20px; font-size:20px;">入馆<br/>预约</a><br/>
            </div>
    <!--大屏幕左右侧菜单-->

</body>
</html>
<script>
    //语言设置
    var language="";
    if(language=="en")
        $("#language").text("中文");
    else
        $("#language").text("English");
    $("#language").click(function(){
		if(window.location.href.indexOf("?")>0){
			if(this.innerText=='English'){
				if(window.location.href.indexOf("language")>0)
					window.location.href = window.location.href.substring(0,window.location.href.indexOf("language"))+"&language=en";
				else
					window.location.href = window.location.href+"&language=en";
			}
			if(this.innerText=='中文'){
				if(window.location.href.indexOf("language")>0)
					window.location.href = window.location.href.substring(0,window.location.href.indexOf("language"))+"&language=zh";
				else
					window.location.href = window.location.href+"&language=zh";
			}
		}else{
			if(this.innerText=='English')
            	window.location.href=window.location.pathname+"?language=en";
        	if(this.innerText=='中文')
            	window.location.href=window.location.pathname+"?language=zh";
		}
    });
function foot_set(){
    //底部固定
    var content_top = $(window).height();
    var footer_top = $('.foots').offset().top;
    if (footer_top < content_top) {
        $('.foots').css('position', 'absolute')
        $('.foots').css('bottom', 0)
    }
}
    window.ska = {
        'bookRule':"zh"=="en"?[""]:["<p>1\u3001\u9884\u7ea6\u9014\u5f84\u3002\u53ef\u901a\u8fc7\u6821\u56ed\u7f51\u7684PC\u673a\u6216\u79fb\u52a8\u8bbe\u5907\u8bbf\u95ee\u56fe\u4e66\u9986\u7f51\u7ad9\u6216\u5fae\u4fe1\u516c\u4f17\u53f7\u64cd\u4f5c\u3002<\/p>","<p>2\u3001\u9884\u7ea6\u65f6\u95f4\u30026\uff1a00\u201422\uff1a00\u9884\u7ea6\u5f53\u65e5\u548c\u6b21\u65e5\uff0c22\uff1a00\u201423\uff1a59\u4ec5\u9884\u7ea6\u6b21\u65e5\u3002<\/p >","<p>3\u3001\u9884\u7ea6\u7b7e\u5230\u3002\u5f53\u65e5\u5ea7\u4f4d30\u5206\u949f\u5185\u5165\u9986\uff0c\u6b21\u65e5\u5ea7\u4f4d08\uff1a30\u524d\u5165\u9986\uff0c\u95e8\u7981\u81ea\u52a8\u7b7e\u5230\uff1b\u672a\u6309\u65f6\u7b7e\u5230\u8005\uff0c\u5ea7\u4f4d\u81ea\u52a8\u91ca\u653e\uff0c\u5e76\u8bb0\u8fdd\u7ea61\u6b21\uff1b<\/p>","<p>4\u3001\u53d6\u6d88\u9884\u7ea6\u3002\u5f53\u65e5\u5ea7\u4f4d\u987b\u5165\u9986\u7b7e\u79bb\uff1b\u6b21\u65e5\u5ea7\u4f4d\u987b\u572807\uff1a30\u524d\u53d6\u6d88\uff1b<\/p>","<p>5\u3001\u79bb\u9986\u7b7e\u79bb\u3002\u79bb\u9986\u8bf7\u5728\u5ea7\u4f4d\u9884\u7ea6\u673a\u4e0a\u7b7e\u79bb\u6216\u4e34\u65f6\u79bb\u5f00\u3002\u4e34\u65f6\u79bb\u5f00\uff0c\u5ea7\u4f4d\u4fdd\u755930\u5206\u949f\u3002\u5348\u996d(11\uff1a30--13\uff1a30)\u3001\u665a\u996d(17\uff1a30--19\uff1a00)\u4fdd\u755960\u5206\u949f\uff0c\u672a\u6309\u65f6\u8fd4\u56de\uff0c\u5ea7\u4f4d\u81ea\u52a8\u91ca\u653e\uff0c\u5e76\u8bb0\u8fdd\u89c41\u6b21\uff1b\u672a\u7b7e\u79bb\u5ea7\u4f4d\u8bfb\u8005\uff0c\u5c06\u88ab\u8bb0\u201c\u672a\u7b7e\u79bb\u201d\u8fdd\u89c4 1 \u6b21\u3002<\/p>","<p>6\u3001\u95e8\u7981\u4e0e\u9009\u5ea7\u8054\u52a8\u3002\u65e0\u5f53\u65e5\u5165\u9986\u8bb0\u5f55\u8005\uff0c\u9986\u5185\u65e0\u6cd5\u7b7e\u5230\u6216\u9009\u5ea7\u3002<\/p>","<p>7\u3001\u8fdd\u89c4\u5904\u7406\u3002\u76f8\u540c\u7c7b\u578b\u8fdd\u89c4\u6216\u8fdd\u7ea6\u8fbe\u52303\u6b21\uff0c\u5c06\u88ab\u6682\u505c\u9009\u5ea77\u5929\uff08168\u5c0f\u65f6\uff09\uff1b\u5982\u9047\u505c\u7535\u6216\u8bbe\u5907\u6545\u969c\u7b49\u7279\u6b8a\u60c5\u51b5\u9020\u6210\u8bfb\u8005\u8fdd\u89c4\u6216\u8fdd\u7ea6\u8bb0\u5f55\uff0c\u7531\u9986\u5185\u7edf\u4e00\u5904\u7406\u3002<\/p>"],
        'backUrl':"/web/index",
        'areaUrl':"/web/area",
        'dayApi':"/api.php/space_days",
        'timeApi':"/api.php/space_time_buckets",
        'usersApi':"/api.php/users",
        'spacesApi':"/api.php/spaces",
        'areaApi':"/api.php/v3areas",
        'areadaysApi':"/api.php/v3areadays",
        'loginApi': "/api.php/login",
        'logoutApi': "/api.php/logout",
        'access_token':"",
        'userid':"",
        'username':"",
        'checkUrl':"/api.php/check",
        'heatColor':{"1":"#00B831","2":"#22CB10","3":"#51CB10","4":"#9ECB10","5":"#CBB910","6":"#CB7A10","7":"#CB5B10","8":"#CB3C10","9":"#CB1D10","10":"#AF001F","11":"#8B8B8B"}    };

    // Step:3 conifg ZRender's path, link to zrender.js from current page.
    // Step:3 为模块加载器配置zrender的路径，从当前页面链接到zrender.js
    require.config({
        paths:{
            'zrender':'/Public/static/zrender/zrender',
            'zrender/shape/Polygon' : '/Public/static/zrender/zrender'
        }
    });
    var size = Math.floor($('#content').width()/1920*100)/100;
    if(size < 0.2)
        size = 0.2;
    /*if(window.innerWidth>1900){
        var content_top=window.innerHeight-$("#content").offset().top-55-39;
        if(1080*size>content_top)
            size = (content_top/1080).toFixed(2);
    }*/

    $(document).ready(function () {
        //首页是否显示
        if(0==0){
            $('.menu li:first').css("display","none");
            $('.mobile_menu li:first').css("display","none");
        }
        //中英文切换按钮是否显示
        if(0==0){
            $('#language').css("display","none");
        }
        //入馆预约按钮是否显示
        if(0==0){
            $('#rgyy').css("display","none");
        }

        //floor尺寸设定
        //var contentheight = $(window).height()-$("#content").offset().top-$('.foots').height();
        //if(contentheight > Math.round(1080*size))
            //$("#content").css('height',contentheight);
        //else
            $("#content").css('height',Math.round(1080*size));
        if($("#content").width() > Math.round(1920*size))
            $("#content").css('width',Math.round(1920*size));
        $("#floor").css('height',Math.round(1080*size));
        $("#floor").css('width',Math.round(1920*size));
        $("#floor").css('backgroundSize',Math.round(1920*size)+'px '+Math.round(1080*size)+'px');
        //手机屏幕上显示时显示右侧信息
        $("#content").scrollLeft($("#content")[0].scrollWidth);

        var floor = document.getElementById('floor')
        var instance = panzoom(floor,{
            bounds : true,
            boundsPadding : 1,
            //boundsPadding : Math.round(1080*size)/$("#content").height(),zhe
            maxZoom : 1 ,
            minZoom : 1,
            initialZoom: 1,
            onTouch: function(e) {
                return false;
            },onDoubleClick: function(e) {
                return false;
            }
        });

        $("#changeplace").hover(function () {
            $(".place_menu").css("display", "block");
        }, function () {
            $(".place_menu").css("display", "none");
        });

        //位置信息 2020年8月5日15:42:41   by：strangesheep
        var floorpos=0;
        var position="";
        var len=3?3:0;
        for(i=0;i< len;i++){
            if('0'=='1')
                position+=" ";
            if('0'=='0')
                position+='\n';
        }

        var day =  "";
        var date = new Date();
        var today = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate();
        if(day=="")
            day=today;
        $("#yuyuetime").html(day);
        var d = new Date(day);
        var dd = d.toDateString().split(" ");
        //英文日期
        $("#yuyuetime2").html(dd[1]+'.'+dd[2]+' '+dd[0]+','+dd[3]);
        var requrl = ska.areaApi+"/1";
        if(day!=today)//当天时传空值进去
            requrl = ska.areaApi+"/1/date/"+day;
        //$("#content").mCustomScrollbar({ horizontalScroll: true });
        load_area(requrl,function(data){
            //console.log(data);
            //显示当前预约场馆名称
            $("#libraryname").html(data.data.list.areaInfo.name);
            $("#libraryenname").html(data.data.list.areaInfo.enname);
            if(data.status ==1 ){
                var areas = data.data.list.childArea;
                //获取热度的是否开启
                var heat_open = '1';
                ////console.log(areas);
                // Step:4 require zrender and use it in the callback.
                // Step:4 动态加载zrender然后在回调函数中开始使用
                require(
                    ['zrender','zrender/shape/Polygon'],
                    function(zrender) {
                        var zr = zrender.init(document.getElementById('floor'));// 初始化


                        jQuery.each(areas, function(index, val) {
                            var areas_id = val.id;
                            var areas_status = val.isValid;
                            var content;
                            //网页端禁止预约区域
                            var webdisable=[];
                            if(webdisable.indexOf(val.id)>=0){
                                content = position+"请到现场预约";
                                val.isValid=0;
                                createBlock(zr,[
                                [Math.round(val.point_x*1920/100*size), Math.round(val.point_y*1080/100*size)],
                                [Math.round(val.point_x2*1920/100*size), Math.round(val.point_y2*1080/100*size)],
                                [Math.round(val.point_x3*1920/100*size), Math.round(val.point_y3*1080/100*size)],
                                [Math.round(val.point_x4*1920/100*size), Math.round(val.point_y4*1080/100*size)]
                                ],'#5AC306',content,16,areas_id,day,val.isValid?areas_status:val.isValid,val);
                            }else{
                                if(val.isValid){
                                    content = val.isValid ? position+'空闲:'+(val.TotalCount-val.UnavailableSpace)+'\n'+((floorpos==1)?position:"")+'总数:'+val.TotalCount: position+"暂停预约";
                                }else{
                                    content = position+"暂停预约";
                                }
                                createBlock(zr,[
                                [Math.round(val.point_x*1920/100*size), Math.round(val.point_y*1080/100*size)],
                                [Math.round(val.point_x2*1920/100*size), Math.round(val.point_y2*1080/100*size)],
                                [Math.round(val.point_x3*1920/100*size), Math.round(val.point_y3*1080/100*size)],
                                [Math.round(val.point_x4*1920/100*size), Math.round(val.point_y4*1080/100*size)]
                                ],'#5AC306',content,16,areas_id,day,val.isValid?areas_status:val.isValid,val);
                            }
                        });
                        zr.render();// 绘画
                        foot_set();//底部处理
                    }
                );

            }else{
                alertDialog('无可预约区域','error');
            }
        });

        //获取区域最大可预约天数
        load_area2(ska.areadaysApi+"/"+1,function(data){
            //console.log(data);
            if(data.status ==1 ){
                var maxday = data.data.list;
                var weekday = new Array('周日','周一','周二','周三','周四','周五','周六');
                if(""=="en")
                    weekday = new Array('Sun.','Mon.','Tues.','Wed.','Thur.','Fri.','Sat.');
                var ret_html="";
                var ret_html_phone="";
                for(i=0;i<maxday.length;i++){
                    var myDate = new Date(Date.parse(maxday[i].day.date.substring(0,10)))
                    var day="";
                    var nowday=new Date();
                    if(day)
                        nowday = new Date(Date.parse(day));
                    var today=new Date();

                    var TodayStr="";
                    var datestr="";
                    //中英文切换
                    if(""=="en"){
                        TodayStr=" Today";
                        var myDateStr = myDate.toDateString().split(" ");
                        datestr = myDateStr[1]+'.'+myDateStr[2];
                    }else{
                        TodayStr=" 今天";
                        datestr = (myDate.getMonth() + 1)+'月'+myDate.getDate()+'日';
                    }
                    if((myDate.getMonth()==nowday.getMonth())&&(myDate.getDate()==nowday.getDate())){
                        if((myDate.getMonth()==today.getMonth())&&(myDate.getDate()==today.getDate())){
                            ret_html+="<a class=\"btn btn-default active area_day\" href=\"/home/web/seat/area/"+1+"/day/"+myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+"\" role=\"button\">"+datestr+TodayStr+"</a>";
                            ret_html_phone+="<li role=\"separator\" class=\"divider\"></li>"+
                            "<li class=\"active\"><a href=\"/home/web/seat/area/"+1+"/day/"+myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+"\">"+datestr+TodayStr+"</a></li>";
                        }else{
                            ret_html+="<a class=\"btn btn-default active area_day\" href=\"/home/web/seat/area/"+1+"/day/"+myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+"\" role=\"button\">"+datestr+' '+weekday[myDate.getDay()]+"</a>";
                            ret_html_phone+="<li role=\"separator\" class=\"divider\"></li>"+
                                "<li class=\"active\"><a href=\"/home/web/seat/area/"+1+"/day/"+myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+"\">"+datestr+' '+weekday[myDate.getDay()]+"</a></li>";
                        }
                    }
                    else{
                        if((myDate.getMonth()==today.getMonth())&&(myDate.getDate()==today.getDate())){
                            ret_html+="<a class=\"btn btn-default area_day\" href=\"/home/web/seat/area/"+1+"/day/"+myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+"\" role=\"button\">"+datestr+TodayStr+"</a>";
                            ret_html_phone+="<li role=\"separator\" class=\"divider\"></li>"+
                            "<li><a href=\"/home/web/seat/area/"+1+"/day/"+myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+"\">"+datestr+TodayStr+"</a></li>";
                        }else{
                            ret_html+="<a class=\"btn btn-default area_day\" href=\"/home/web/seat/area/"+1+"/day/"+myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+"\" role=\"button\">"+datestr+' '+weekday[myDate.getDay()]+"</a>";
                            ret_html_phone+="<li role=\"separator\" class=\"divider\"></li>"+
                                "<li><a href=\"/home/web/seat/area/"+1+"/day/"+myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+"\">"+datestr+' '+weekday[myDate.getDay()]+"</a></li>";
                        }
                    }
                }
                ret_html+="<div class=\"clear\"></div>";
                //ret_html_phone+="<li role=\"separator\" class=\"divider\"></li>";
                $("#nav-date").html(ret_html);
                $("#areadays_phone").html(ret_html_phone);
            }else{
                alertDialog('该区域没有可预约的时间','error');
            }
        });

        function createBlock(zr,coordinate,colors,textValue,textValueFont,areaId,day,areaStatus,areaInfo){
            //console.log(coordinate);
            var PolygonShape = require('zrender/shape/Polygon');
            zr.addShape(new PolygonShape({
                style : {
                    pointList : coordinate,
                    brushType : 'both',
                    color : 'rgba(255, 255, 255, 0)',
                    strokeColor : colors,
                    opacity:1,
                    text : textValue,
                    textColor : '#D16602',
                    textFont : 'bold '+Math.round(textValueFont*size)+'px 微软雅黑',
                    textPosition : "inside"     // default top
                    //textAlign : "left",
                    //textVerticalAlign:"top"
                },

                hoverable : true,   // default true
                draggable : false,   // default false
                clickable : true,   // default false
                //增加事件
                onclick: function(params){
                    if(areaStatus==1){
                        window.location.href = "/web/seat2/area/"+areaId+"/day/"+day;
                    }else{
                        alertDialog('该区域暂时关闭预约','error');
                    }
                }
            }));
        }
    });

    //检测登录
	var str="";
    str = str.replace(/\-/g, "/");
    var expire = new Date(str);
    var now = new Date();
	if (ska.username && (now < expire)) {
		$(".login-control").hide();
		$(".logout-control").show();
	}else{
		$(".login-control").show();
		$(".logout-control").hide();
	}
	//登录
	$(".login-btn").click(function(event) {
		 login();
	});
	//登出
	$(".logout-btn").click(function(event) {
		 logout();
	});


	function login(callback){
            //0:汇文系统验证, 1:直接数据库验证,2:url验证,3:指定数据库直接验证,4:单点登录
            if(1==4){
                window.location.href="/cas/index.php?callback="+window.location.href;
                return;
                //$('.login_click').attr("href","/cas/index.php");
                //$('.login_click').removeClass("login-btn");
            }
			loginDialog(ska.loginApi,ska.checkUrl,function(data){
			 	if (data.status == 1) {
			    	//设置access_token
			    	//设置userid
			    	 window.ska.access_token =  data.data._hash_.access_token;
			    	 window.ska.userid =  data.data._hash_.userid;
			    	 window.ska.username =  data.data.list.name;
			    	 //显示登陆成功信息
			    	 $(".login-control").hide();
			    	 $(".logout-control").show();
			    	 $(".login-welcome").html('我的中心');
			    	 dialog({'id':'login-dialog'}).remove();
			    	 //alertDialog('登录成功!','success',10);
			    	 bookRule(ska.bookRule);
					 alertDialog(data.msg,'success',500);
			    	 if (callback instanceof Function) {
			    	 	callback(data);
			    	 }
			    }else{
					var captcha_img = $('#checkpic');
					 var verifyimg = captcha_img.attr("src");
					 if( verifyimg.indexOf('?')>0){
						$('#checkpic').attr("src", verifyimg+'&random='+Math.random());
					 }else{
						$('#checkpic').attr("src", verifyimg.replace(/\?.*$/,'')+'?'+Math.random());
					 }
					 if(data.status == 2){
					 	$(".renege").show();
					 }
			    	 alertDialog(data.msg,'error',1,10000);
			    }
			 });
		}

//		setTimeout(function ()
//			{
//				logout();
//			},360000);

		function logout(){
			logoutDialog(ska.logoutApi,{
			  	'access_token': window.ska.access_token,
			  	'userid': window.ska.userid
			  },function(data){
				if (data.status == 1) {
			    	//console.log(data);
			    	//设置access_token
			    	//设置userid
			    	 window.ska.access_token =  '';
			    	 window.ska.userid = '';
			    	 //显示登陆成功信息
			    	 $(".login-control").show();
			    	 $(".logout-control").hide();
			    	 alertDialog('退出成功，欢迎使用！','success');
                     //如果选择CAS认证则退出时CAS端也一并退出
                     if(1 == 4)
					    window.location="/cas/index.php?logout="+window.location.href;
			    }else{
			    	 alertDialog(data.msg,'error');
			    }
			  });
		}

    //固定顶部操作
    jQuery(function ($) {
        $(document).ready(function () {
             $('.phone_menu').stickUp();
        });
    });
</script>