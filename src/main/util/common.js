/*
 * 系统公共的js函数
 * author liu
 * 注 ：所有弹窗效果 全部依赖于 artDialog 插件
 */

var times; //预约时间段弹窗定时器
var timeBs; //签到签离定时器，提示弹窗
var pageTimer;//页面操作定时器


var dayNum;//可预约天数

//var ska;
function GetQueryString(key) {
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : '';
}

//获取座位状态图标 class
function getSpaceStatusClass(key){
	var status = ['ava-icon','using-icon','book-icon','leave-icon','repair-icon','close-icon']
	switch(key){
		case 1: return status[0] ;break;
		case 2: return status[2] ;break;
		case 3: return status[5] ;break;
		case 4: return status[5] ;break;
		case 5: return status[5] ;break;
		case 6: return status[1] ;break;
		case 7: return status[3] ;break;
		case 8: return status[1] ;break;
		case 9: return status[0] ;break;
		default: return status[4];
	}

	/*1=>'空闲',
	2=>'已预约',
	3=>'锁定',
	4=>'维护',
	5=>'清扫',
	6=>'使用中',
	7=>'临时离开',
	8=>'使用到时提醒',
	9=>'使用到时'*/

}

//某区域预约可用不可用背景颜色
function colorGenerator(all, val){
	//alert(ska.heatColor);
	var colors = ["#00B831", "#22CB10", "#51CB10", "#9ECB10", "#CBB910",
	              "#CB7A10", "#CB5B10", "#CB3C10", "#CB1D10", "#AF001F","#8B8B8B"
	              ];
	var coustomColors = [];
	if(ska.heatColor != ''){
		$.each(ska.heatColor, function(index, val) {
		 coustomColors.push(val);
		});
		colors = coustomColors;
	}

	//console.log(colors);
	var percent = 0;
	if(all == 0){
		percent = 10;
	}else{
		percent = Math.round((1 - val/all) * 9);
	}

	return colors[percent];
}

//载入区域信息
function load_area(url,callback){
		//载入该楼层的下面所有的预约区域
		jQuery.ajax({
			  url: url,
			  type: 'GET',
			  dataType: 'JSON',
			  data: {},
			  beforeSend: function(){
				  loadingDialog();
			  },
			  complete: function(xhr, textStatus) {
			     //called when complete
				 loadingDialogClose();
			  },
			  success: function(data, textStatus, xhr) {
			    //called when successful
				if(callback instanceof Function){
					callback(data);
				}
			  },
			  error: function(xhr, textStatus, errorThrown) {
			  	//弹窗提示获取区域失败
				alertDialog('网络错误，请重试  错误代码:cj01','error');
				//window.location.reload();
				if(callback instanceof Function){
					var data = {'status':0};
					callback(data);
				}
			  }
		});
}
//载入区域信息同步输出
function load_area2(url, callback) {
    //载入该楼层的下面所有的预约区域
    jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        data: {},
        //async: false,
        beforeSend: function () {
            loadingDialog();
        },
        complete: function (xhr, textStatus) {
            //called when complete
            loadingDialogClose();
        },
        success: function (data, textStatus, xhr) {
            //called when successful
            if (callback instanceof Function) {
                callback(data);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //弹窗提示获取区域失败
            alertDialog('网络错误，请重试  错误代码:cj01', 'error');
            //window.location.reload();
            if (callback instanceof Function) {
                var data = { 'status': 0 };
                callback(data);
            }
        }
    });
}
/*创建区域*/
function createBlock(obj,status,areas_id,type){
	if (status == 1) {
			$(obj).removeClass('shape-icon-disabled');
		  	//载入空间预约信息
		  	$(obj).attr({
		  		'data-id': areas_id,
		  		'data-status': status,
		  		'data-book-type':type
		  	});
	}else{
		//空间预约不可用
		$(obj).addClass('shape-icon-disabled');
	}
}

function space_time_buckets_third(area,status,dayApi,timeApi,areaUrl,usersApi,spacesApi,teamApi){
	if(status == 1){
		//获取预约可用天
		var dayUrl = dayApi+"/"+area;

		jQuery.ajax({
			  url: dayUrl,
			  type: 'GET',
			  dataType: 'JSON',
			  data: {},
			  beforeSend: function(){
				  loadingDialog();
			  },
			  complete: function(xhr, textStatus) {
			     //called when complete
				 loadingDialogClose();
			  },
			  success: function(json, textStatus, xhr) {
			      //called when successful
				  if (json.status == 1) {
			   		var day = json.data.list;
			   		var firstDay = $.isArray(day)?day[0]['day']:0;

			   		var tabCon = '';
			   		tabCon += '<div class="time-buckets">';
					tabCon += '<ul class="time-tab-list clearfix">';
			   		$.each(day, function(index, val) {
			   			 tabCon += '<li class="time-tab '+ ( index==0 ?'time-tab-on':'')+'" data-date="'+val['day']+'" onclick="get_time_buckets_third(\''+val['day']+'\','+area+',\''+timeApi+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\',\''+teamApi+'\');">'+DateFormat(new Date(val['day']),'MM-dd')+'<br>('+getDayWeek(val['day'])+')</li>';
			   		});
			   		tabCon += '</ul>';
					tabCon += '<div class="time-tab-content">';
					tabCon += '<ul class="clearfix" id="time-tab-content">';
					//预约时间段
					tabCon += '</ul>';
					tabCon += '</div>';
					tabCon += '<input type="hidden" name="date" value="'+firstDay+'"/>';
			   		tabCon += '<input type="hidden" name="area" value="'+area+'"/>';
					tabCon += '</div>';

					dialog({
						id: 'time-buckets-dialog',
						title: '请选择预约时间',
						skin: 'green-dialog', //设置弹窗的默认皮肤
						//padding: '100px',
						fixed: false,
						quickClose: true,
						content: tabCon,
						onshow: function () {
					         	//弹窗载入成功之后 , 获取当天下面可预约时间段
					         	//alert(firstDay);
								get_time_buckets_third(firstDay,area,timeApi,areaUrl,spacesApi,usersApi,teamApi);
								if (times instanceof Object) {
									times.stop();//结束上次定时器
								}
								times = new Timer(".timer-container", function(){
									 dialog({id: 'time-buckets-dialog'}).close().remove();
								});

								if (pageTimer instanceof Object) {
									pageTimer.pause();
								}
					    },
					    onclose:function(){
					    	if (pageTimer instanceof Object) {
								pageTimer.start();
							}
					    },
						/*okValue: '确 定',
						ok: function () {
							times.stop();
							return false;
						},*/
						cancelValue:'取消',
						cancel:function(){
							times.stop();
						},
						statusbar:'<span class="timer-container" data-timer="30">30</span>'
					}).showModal();
				  }else{
				  	    loadingDialogClose();
						alertDialog('此区域无可用预约时间','error');
				  }
			  },
			  error: function(xhr, textStatus, errorThrown) {
			  	//弹窗提示获取区域失败
				alertDialog('网络错误，请重试  错误代码:cj02','error');
				window.location.reload();
			  }
		});


	}else{
		alertDialog('此区域预约功能暂时关闭','error');
	}
}
function get_time_buckets_third(day,area,timeApi,areaUrl,spacesApi,usersApi,teamApi){
	$('input[name="date"]').val(day);
	$(".time-tab").removeClass('time-tab-on');
	$("li[data-date='"+day+"']").addClass('time-tab-on');
	jQuery.ajax({
		  url: teamApi,
		  type: 'GET',
		  dataType: "JSON",
		  data: {'day': day,'area': area},
		  beforeSend: function(){
			loadingDialog();
		  },
		  complete: function(xhr, textStatus) {
		    //called when complete
		    loadingDialogClose();
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
		    times.stop();//结束上次定时器
		    //重新定时
		    times = new Timer(".timer-container", function(){
				 dialog({id: 'time-buckets-dialog'}).close().remove();
			});
		    var str = '';
		    if(data.status == 1){
		    	var timeSegment = data.data.list;
		    	/*
		    	var firstSegment = $.isArray(timeSegment)?timeSegment[0]['id']:0;
		    	var lastSegment = $.isArray(timeSegment)?timeSegment[timeSegment.length - 1]:0;
				*/
		    	if(timeSegment){
		    		/*
					$.each(timeSegment, function(index, val) {

					  str += '<li class="time-buckets-radio '+(index==0?'radio-checked':'')+'" data-area="'+val['area']+'" data-segment-id="'+val['id']+'" data-beginTime="'+val['startTime']+'" data-endTime="'+val['endTime'];
		    		 if(val['status'] == 1){
		    		 	str += '" onclick="select_segment('+val['id']+',\''+day+'\',\''+val['startTime']+'\',\''+val['endTime']+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\')"' + "style='background:#64ba00;'" +'>';
		    		 }else{
		    		 	str += '" onclick="space_outof_book()"' + "style='background:#CCC;'"+'>';
		    		 }
		    		 str += val['startTime']+' - '+val['endTime']+'</li>';
		    		});
		    		str += '<input type="hidden" name="segment" value="'+firstSegment+'"/>';
					*/
					str += '<div class="content" id="content1">';
					str += '<a  style="left:5%;"   class="prev"><div value="10" class="tishi"></div><div class="bigtishi"></div></a>';
					str += '<a  style="left:95%" class="next"><div class="tishi"></div></a>';
					str += '<dl class="list">';

					str += '</dl><div class="blue">	<div class="date"></div> </div></div>';

		    	}else{
					str = '<div class="no-time-segment">暂无可预约时间段</div>';
		    	}
		    }else{
		    	str = '<div class="no-time-segment">暂无可预约时间段</div>';
		    }
		    $("#time-tab-content").html(str);
			$("#content1").TimeLine({
			startDate:timeSegment['startTime'], //开始时间
			endDate:timeSegment['endTime'],   //结束时间
			everyCell:5,      //每格时间
			blockTime:12,		//要显示的时间
			moveBlockWidth:22,
			startTime:timeSegment['bookbegintime'],
			endTime:timeSegment['bookendtime'],
			minTime:timeSegment['minTime'],
			maxTime:timeSegment['maxTime']

	});
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    //弹窗提示获取区域失败
			alertDialog('网络错误，请重试  错误代码:cj03','error');
		  }
		});
}
//预约时间tab
function space_time_buckets(area,status,dayApi,timeApi,areaUrl,usersApi,spacesApi){
	if(status == 1){
		//获取预约可用天
		var dayUrl = dayApi+"/"+area;
		jQuery.ajax({
			  url: dayUrl,
			  type: 'GET',
			  dataType: 'JSON',
			  data: {},
			  beforeSend: function(){
				  loadingDialog();
			  },
			  complete: function(xhr, textStatus) {
			     //called when complete
				 loadingDialogClose();
			  },
			  success: function(json, textStatus, xhr) {
			      //called when successful
				  if (json.status == 1) {
			   		var day = json.data.list;
					//dayNum = json.data.daynum;
			   		var firstDay = $.isArray(day)?day[0]['day']:0;
			   		var tabCon = '';
			   		tabCon += '<div class="time-buckets">';
					//console.log("xxx");
					//tabCon += '<span class="time-tab-button-left" style="display:none;" onclick="jumpDayL();">左</span>';
					tabCon += '<ul class="time-tab-list clearfix">';
			   		$.each(day, function(index, val) {
			   			tabCon += '<li class="time-tab '+ ( index==0 ?'time-tab-on':'')+'" data-date="'+val['day']+'" onclick="get_time_buckets(\''+val['day']+'\','+area+',\''+timeApi+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\');">'+DateFormat(new Date(val['day']),'MM-dd')+'<br>('+getDayWeek(val['day'])+')</li>';
			   			//tabCon += '<li class="time-tab '+ ( index==0 ?'time-tab-on':'')+'" data-date="'+val['day']+ ( index>=7 ?' style="display: none;"':'')+'" onclick="get_time_buckets(\''+val['day']+'\','+area+',\''+timeApi+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\');">'+DateFormat(new Date(val['day']),'MM-dd')+'<br>('+getDayWeek(val['day'])+')</li>';
					});
			   		tabCon += '</ul>';
					tabCon += '<div class="time-tab-content">';
					tabCon += '<ul class="clearfix" id="time-tab-content">';
					//预约时间段
					tabCon += '</ul>';
					//tabCon += '<span class="time-tab-button-right" '+(dayNum<7?'style="display: none;"':'')+' onclick="jumpDayR();">右</span>';
					tabCon += '</div>';
					tabCon += '<input type="hidden" name="date" value="'+firstDay+'"/>';
			   		tabCon += '<input type="hidden" name="area" value="'+area+'"/>';
					tabCon += '</div>';

					dialog({
						id: 'time-buckets-dialog',
						title: '请选择预约时间',
						skin: 'green-dialog', //设置弹窗的默认皮肤
						//padding: '100px',
						fixed: false,
						quickClose: true,
						content: tabCon,
						onshow: function () {
					         	//弹窗载入成功之后 , 获取当天下面可预约时间段
					         	//alert(firstDay);
								get_time_buckets(firstDay,area,timeApi,areaUrl,spacesApi,usersApi);
								if (times instanceof Object) {
									times.stop();//结束上次定时器
								}
								times = new Timer(".timer-container", function(){
									 dialog({id: 'time-buckets-dialog'}).close().remove();
								});

								if (pageTimer instanceof Object) {
									pageTimer.pause();
								}
					    },
					    onclose:function(){
					    	if (pageTimer instanceof Object) {
								pageTimer.start();
							}
					    },
						/*okValue: '确 定',
						ok: function () {
							times.stop();
							return false;
						},*/
						cancelValue:'取消',
						cancel:function(){
							times.stop();
						},
						statusbar:'<span class="timer-container" data-timer="30">30</span>'
					}).showModal();
				  }else{
				  	    loadingDialogClose();
						alertDialog('此区域无可用预约时间','error');
				  }
			  },
			  error: function(xhr, textStatus, errorThrown) {
			  	//弹窗提示获取区域失败
				alertDialog('网络错误，请重试  错误代码:cj04','error');
				window.location.reload();
			  }
		});


	}else{
		alertDialog('此区域预约功能暂时关闭','error');
	}
}

function space_time_buckets_two(area,status,dayApi,timeApi,areaUrl,usersApi,spacesApi){
	if(status == 1){
		//获取预约可用天
		var dayUrl = dayApi+"/"+area;

		jQuery.ajax({
			  url: dayUrl,
			  type: 'GET',
			  dataType: 'JSON',
			  data: {},
			  beforeSend: function(){
				  loadingDialog();
			  },
			  complete: function(xhr, textStatus) {
			     //called when complete
				 loadingDialogClose();
			  },
			  success: function(json, textStatus, xhr) {
			      //called when successful
				  if (json.status == 1) {
			   		var day = json.data.list;
					dayNum = json.data.daynum;
			   		var firstDay = $.isArray(day)?day[0]['day']:0;
			   		var tabCon = '';
			   		tabCon += '<div class="time-buckets">';

					//console.log("xxx");
					tabCon += '<span class="time-tab-button-left" style="display:none;" onclick="jumpDayL();">向左</span>';

					tabCon += '<ul class="time-tab-list clearfix">';
			   		$.each(day, function(index, val) {
						//console.log(index);
			   			 //tabCon += '<li class="time-tab '+ ( index==0 ?'time-tab-on':'')+'" data-date="'+val['day']+'" onclick="get_time_buckets_two(\''+val['day']+'\','+area+',\''+timeApi+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\');">'+DateFormat(new Date(val['day']),'MM-dd')+'<br>('+getDayWeek(val['day'])+')</li>';
			   			tabCon += '<li class="time-tab '+ ( index==0 ?'time-tab-on':'')+'" data-date="'+val['day']+ ( index>=7 ?' "style="display: none;" ':'')+'" onclick="get_time_buckets_two(\''+val['day']+'\','+area+',\''+timeApi+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\');">'+DateFormat(new Date(val['day']),'MM-dd')+'<br>('+getDayWeek(val['day'])+')</li>';
					});
			   		tabCon += '</ul>';
					tabCon += '<div class="time-tab-content">';
					tabCon += '<ul class="clearfix" id="time-tab-content">';
					//预约时间段
					tabCon += '</ul>';

					//tabCon += '<span class="time-tab-button-right" '+(dayNum<7?'style="display: none;"':'')+' onclick="jumpDayR();">右</span>';
					tabCon += '<span class="time-tab-button-right" '+(dayNum<7?'style="display: none;"':'')+' onclick="jumpDayR();">向右</span>';

					tabCon += '</div>';
					tabCon += '<input type="hidden" name="date" value="'+firstDay+'"/>';
			   		tabCon += '<input type="hidden" name="area" value="'+area+'"/>';
					tabCon += '</div>';


					dialog({
						id: 'time-buckets-dialog',
						title: '请选择预约时间',
						//skin: 'green-dialog', //设置弹窗的默认皮肤
						//padding: '100px',
						fixed: false,
						quickClose: true,
						content: tabCon,
						onshow: function () {
					         	//弹窗载入成功之后 , 获取当天下面可预约时间段
					         	//alert(firstDay);
								get_time_buckets_two(firstDay,area,timeApi,areaUrl,spacesApi,usersApi);
								if (times instanceof Object) {
									times.stop();//结束上次定时器
								}
								times = new Timer(".timer-container", function(){
									 dialog({id: 'time-buckets-dialog'}).close().remove();
								});

								if (pageTimer instanceof Object) {
									pageTimer.pause();
								}
					    },
					    onclose:function(){
					    	if (pageTimer instanceof Object) {
								pageTimer.start();
							}
					    },
						/*okValue: '确 定',
						ok: function () {
							times.stop();
							return false;
						},*/
						cancelValue:'取消',
						cancel:function(){
							times.stop();
						},
						statusbar:'<span class="timer-container" data-timer="30">30</span>'
					}).showModal();
				  }else{
				  	    loadingDialogClose();
						alertDialog('此区域无可用预约时间','error');
				  }
			  },
			  error: function(xhr, textStatus, errorThrown) {
			  	//弹窗提示获取区域失败
				alertDialog('网络错误，请重试  错误代码:cj05','error');
				window.location.reload();
			  }
		});


	}else{
		alertDialog('此区域预约功能暂时关闭','error');
	}
}

//预约时间tab
function space_time_buckets_one(area,status,dayApi,timeApi,areaUrl,usersApi,spacesApi){
	if(status == 1){
		//获取预约可用天
		var dayUrl = dayApi+"/"+area;
		/*loadingDialog();
		jQuery.getJSON(dayUrl, {}, function(json, textStatus) {
		  //console.log(json);
		  loadingDialogClose();
		  //optional stuff to do after success
		  if (json.status == 1) {
		   		var day = json.data.list;
		   		var firstDay = $.isArray(day)?day[0]['day']:0;
		   		var tabCon = '';
		   		tabCon += '<div class="time-buckets">';
				tabCon += '<ul class="time-tab-list clearfix">';
		   		$.each(day, function(index, val) {
		   			 tabCon += '<li class="time-tab '+ ( index==0 ?'time-tab-on':'')+'" data-date="'+val['day']+'" onclick="get_time_buckets(\''+val['day']+'\','+area+',\''+timeApi+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\');">'+DateFormat(new Date(val['day']),'MM-dd')+'<br>('+getDayWeek(val['day'])+')</li>';
		   		});
		   		tabCon += '</ul>';
				tabCon += '<div class="time-tab-content">';
				tabCon += '<ul class="clearfix" id="time-tab-content">';
				//预约时间段
				tabCon += '</ul>';
				tabCon += '</div>';
				tabCon += '<input type="hidden" name="date" value="'+firstDay+'"/>';
		   		tabCon += '<input type="hidden" name="area" value="'+area+'"/>';
				tabCon += '</div>';

				dialog({
					id: 'time-buckets-dialog',
					title: '请选择预约时间',
					skin: 'green-dialog', //设置弹窗的默认皮肤
					padding: '100px',
					fixed: false,
					content: tabCon,
					onshow: function () {
				         	//弹窗载入成功之后 , 获取当天下面可预约时间段
				         	//alert(firstDay);
							get_time_buckets(firstDay,area,timeApi,areaUrl,spacesApi,usersApi);
							if (times instanceof Object) {
								times.stop();//结束上次定时器
							}
							times = new Timer(".timer-container", function(){
								 dialog({id: 'time-buckets-dialog'}).close().remove();
							});

							if (pageTimer instanceof Object) {
								pageTimer.pause();
							}
				    },
				    onclose:function(){
				    	if (pageTimer instanceof Object) {
							pageTimer.start();
						}
				    },
					cancelValue:'取消',
					cancel:function(){
						times.stop();
					},
					statusbar:'<span class="timer-container" data-timer="30">30</span>'
				}).showModal();
		  }else{
		  	    loadingDialogClose();
				alertDialog('此区域无可用预约时间','error');
		  }
		});*/


		jQuery.ajax({
			  url: dayUrl,
			  type: 'GET',
			  dataType: 'JSON',
			  data: {},
			  beforeSend: function(){
				  loadingDialog();
			  },
			  complete: function(xhr, textStatus) {
			     //called when complete
				 loadingDialogClose();
			  },
			  success: function(json, textStatus, xhr) {
			      //called when successful
				  if (json.status == 1) {
			   		var day = json.data.list;
			   		var firstDay = $.isArray(day)?day[0]['day']:0;
			   		var tabCon = '';
			   		tabCon += '<div class="time-buckets">';
					tabCon += '<ul class="time-tab-list clearfix">';
			   		$.each(day, function(index, val) {
			   			 tabCon += '<li class="time-tab '+ ( index==0 ?'time-tab-on':'')+'" data-date="'+val['day']+'" onclick="get_time_buckets(\''+val['day']+'\','+area+',\''+timeApi+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\');">'+DateFormat(new Date(val['day']),'MM-dd')+'<br>('+getDayWeek(val['day'])+')</li>';
			   		});
			   		tabCon += '</ul>';
					tabCon += '<div class="time-tab-content">';
					tabCon += '<ul class="clearfix" id="time-tab-content">';
					//预约时间段
					tabCon += '</ul>';
					tabCon += '</div>';
					tabCon += '<input type="hidden" name="date" value="'+firstDay+'"/>';
			   		tabCon += '<input type="hidden" name="area" value="'+area+'"/>';
					tabCon += '</div>';

					get_time_buckets_one(firstDay,area,timeApi,areaUrl,spacesApi,usersApi);

//					dialog({
//						id: 'time-buckets-dialog',
//						title: '请选择预约时间',
//						skin: 'green-dialog', //设置弹窗的默认皮肤
//						padding: '100px',
//						fixed: false,
//						content: tabCon,
//						onshow: function () {
//					         	//弹窗载入成功之后 , 获取当天下面可预约时间段
//					         	//alert(firstDay);
//								get_time_buckets(firstDay,area,timeApi,areaUrl,spacesApi,usersApi);
//								if (times instanceof Object) {
//									times.stop();//结束上次定时器
//								}
//								times = new Timer(".timer-container", function(){
//									 dialog({id: 'time-buckets-dialog'}).close().remove();
//								});
//
//								if (pageTimer instanceof Object) {
//									pageTimer.pause();
//								}
//					    },
//					    onclose:function(){
//					    	if (pageTimer instanceof Object) {
//								pageTimer.start();
//							}
//					    },
//						/*okValue: '确 定',
//						ok: function () {
//							times.stop();
//							return false;
//						},*/
//						cancelValue:'取消',
//						cancel:function(){
//							times.stop();
//						},
//						statusbar:'<span class="timer-container" data-timer="30">30</span>'
//					}).showModal();
				  }else{
				  	    loadingDialogClose();
						alertDialog('此区域无可用预约时间','error');
				  }
			  },
			  error: function(xhr, textStatus, errorThrown) {
			  	//弹窗提示获取区域失败
				alertDialog('网络错误，请重试  错误代码:cj06','error');
				window.location.reload();
			  }
		});


	}else{
		alertDialog('此区域预约功能暂时关闭','error');
	}
}
/*非独立空间预约检测状态*/
function getTeamSpaces(area,segment,type,spacesApi,callback){
	jQuery.ajax({
		  url: spacesApi,
		  type: 'GET',
		  dataType: 'JSON',
		  data: { 'area': area, 'segment': segment ,'type':type},
		  beforeSend: function(){
			loadingDialog();
	 	  },
		  complete: function(xhr, textStatus) {
		    //called when complete
		    loadingDialogClose();
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
		    //console.log(spacesApi);
		    if (callback instanceof Function) {
		     	callback(data);
		     }
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    alertDialog('网络错误，请重试  错误代码:cj07','error');
		  }
	});
}
/*非独立空间预约检测状态*/
function getTeamSpaces_new(area,type,spacesApi,callback){
	jQuery.ajax({
		  url: spacesApi+'/'+area,
		  type: 'GET',
		  dataType: 'JSON',
		  data: '',
		  //data: query,
		  beforeSend: function(){
			loadingDialog();
	 	  },
		  complete: function(xhr, textStatus) {
		    //called when complete
		    loadingDialogClose();
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
		    //console.log(spacesApi);
		    if (callback instanceof Function) {
		     	callback(data);
		     }
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    alertDialog('网络错误，请重试  错误代码:cj08','error');
		  }
	});
}

function checkTeamTime(area,day,startTime,endTime,bookRuleUrl,callback){
	jQuery.ajax({
	  url: bookRuleUrl,
	  type: 'POST',
	  dataType: 'JSON',
	  data: { 'area': area,'day':day, 'startTime': startTime ,'endTime':endTime},
	  beforeSend: function(){
			loadingDialog();
	  },
	  complete: function(xhr, textStatus) {
	    //called when complete
	    loadingDialogClose();
	  },
	  success: function(data, textStatus, xhr) {
	    //执行回调函数
		if(callback instanceof Function){
			callback(data);
			//bookrule = data.status;
			//bookmsg = data.msg;
		}
	  },
	  error: function(xhr, textStatus, errorThrown) {
	    //called when there is an error
	    alertDialog('网络错误，请重试  错误代码:cj09','error');
	  }
	});
}

//选择某个预约时间段
function select_segment_new(area,day,startTime,endTime,areaUrl,spacesApi,usersApi,bookRuleUrl){

	$(".time-buckets-radio").removeClass('radio-checked');

	//触发
    var area_id = area;//获取到区域id
	var bookrule = 0;//预约规则
	var bookmsg = '请选择预约时间';

	checkTeamTime(area_id,day,startTime,endTime,bookRuleUrl,function(data){
		if(data.status != 1){
				alertDialog(data.msg,'error');
		}else{
			getTeamSpaces_new(area_id,2,spacesApi,function(datas){
			//alert(datas.status);
			//console.log(data);
			if (datas.status) {
				spacesInfos = datas['data']['list'];
				if ((spacesInfos.status == 1)||(spacesInfos.status == 2)||(spacesInfos.status == 6)||(spacesInfos.status == 7)||(spacesInfos.status == 8)||(spacesInfos.status == 9)) {
					teamBookDialog(datas['data']['list'],day,startTime,endTime,usersApi,spacesApi);
				}else{
					alertDialog('此时间段该空间预约，'+spacesInfos.status_name,'error');
				}

			}else{
				alertDialog('该区域无可预约空间预约  错误代码:cj10','error');
			}
			});

		}
	})




}




function get_time_buckets_two(day,area,timeApi,areaUrl,spacesApi,usersApi){
	$('input[name="date"]').val(day);
	$(".time-tab").removeClass('time-tab-on');
	$("li[data-date='"+day+"']").addClass('time-tab-on');
	jQuery.ajax({
		  url: timeApi,
		  type: 'GET',
		  dataType: "JSON",
		  data: {'day': day,'area': area},
		  beforeSend: function(){
			loadingDialog();
		  },
		  complete: function(xhr, textStatus) {
		    //called when complete
		    loadingDialogClose();
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
		    times.stop();//结束上次定时器
		    //重新定时
		    /*times = new Timer(".timer-container", function(){
				 dialog({id: 'time-buckets-dialog'}).close().remove();
			});*/
		    var str = '';
		    if(data.status == 1){
		    	var timeSegment = data.data.list;
		    	var firstSegment = $.isArray(timeSegment)?timeSegment[0]['id']:0;
		    	if(timeSegment){
		    		$.each(timeSegment, function(index, val) {
		    		 str += '<li class="time-buckets-radio '+(index==0?'radio-checked':'')+'" data-area="'+val['area']+'" data-segment-id="'+val['id']+'" data-beginTime="'+val['startTime']+'" data-endTime="'+val['endTime']+'" onclick="select_segment('+val['id']+',\''+day+'\',\''+val['startTime']+'\',\''+val['endTime']+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\')">'+val['startTime']+' - '+val['endTime']+'</li>';
		    		});
		    		str += '<input type="hidden" name="segment" value="'+firstSegment+'"/>';
		    	}else{
					str = '<div class="no-time-segment">暂无可预约时间段</div>';
		    	}
		    }else{
		    	str = '<div class="no-time-segment">暂无可预约时间段</div>';
		    }
		    $("#time-tab-content").html(str);
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    //弹窗提示获取区域失败
			alertDialog('网络错误，请重试  错误代码:cj11','error');
		  }
		});
}

function get_time_buckets(day,area,timeApi,areaUrl,spacesApi,usersApi){
	$('input[name="date"]').val(day);
	$(".time-tab").removeClass('time-tab-on');
	$("li[data-date='"+day+"']").addClass('time-tab-on');
	jQuery.ajax({
		  url: timeApi,
		  type: 'GET',
		  dataType: "JSON",
		  data: {'day': day,'area': area},
		  beforeSend: function(){
			loadingDialog();
		  },
		  complete: function(xhr, textStatus) {
		    //called when complete
		    loadingDialogClose();
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
		    times.stop();//结束上次定时器
		    //重新定时
		    times = new Timer(".timer-container", function(){
				 dialog({id: 'time-buckets-dialog'}).close().remove();
			});
		    var str = '';
		    if(data.status == 1){
		    	var timeSegment = data.data.list;
		    	var firstSegment = $.isArray(timeSegment)?timeSegment[0]['id']:0;
		    	if(timeSegment){
					/*
		    		$.each(timeSegment, function(index, val) {
		    		 str += '<li class="time-buckets-radio '+(index==0?'radio-checked':'')+'" data-area="'+val['area']+'" data-segment-id="'+val['id']+'" data-beginTime="'+val['startTime']+'" data-endTime="'+val['endTime']+'" onclick="select_segment('+val['id']+',\''+day+'\',\''+val['startTime']+'\',\''+val['endTime']+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\')">'+val['startTime']+' - '+val['endTime']+'</li>';
		    		});
					*/
					$.each(timeSegment, function(index, val) {
					 /*
		    		 str += '<li class="time-buckets-radio '+(index==0?'radio-checked':'')+'" data-area="'+val['area']+'" data-segment-id="'+val['id']+'" data-beginTime="'+val['startTime']+'" data-endTime="'+val['endTime']+'" onclick="select_segment('+val['id']+',\''+day+'\',\''+val['startTime']+'\',\''+val['endTime']+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\')"';
		    		 if(val['status'] == '1'){
		    		 	str += "style='background:green;'" +'>';
		    		 }else{
		    		 	str += "style='background:red;'"+'>';
		    		 }
					 */
					  str += '<li class="time-buckets-radio '+(index==0?'radio-checked':'')+'" data-area="'+val['area']+'" data-segment-id="'+val['id']+'" data-beginTime="'+val['startTime']+'" data-endTime="'+val['endTime'];
		    		 if(val['status'] == 1){
		    		 	str += '" onclick="select_segment('+val['id']+',\''+day+'\',\''+val['startTime']+'\',\''+val['endTime']+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\')"' + "style='background:#64ba00;'" +'>';
		    		 }else{
		    		 	str += '" onclick="space_outof_book()"' + "style='background:#CCC;'"+'>';
		    		 }
		    		 str += val['startTime']+' - '+val['endTime']+'</li>';
		    		});
		    		str += '<input type="hidden" name="segment" value="'+firstSegment+'"/>';
		    	}else{
					str = '<div class="no-time-segment">暂无可预约时间段</div>';
		    	}
		    }else{
		    	str = '<div class="no-time-segment">暂无可预约时间段</div>';
		    }
		    $("#time-tab-content").html(str);
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    //弹窗提示获取区域失败
			alertDialog('网络错误，请重试  错误代码:cj12','error');
		  }
		});
}

function space_outof_book(){
	alertDialog('此时间段已经被预约，请选择其他时间段','error');
}

var areaId,segmentId;
//获取时间段
function get_time_buckets_one(day,area,timeApi,areaUrl,spacesApi,usersApi){
	$('input[name="date"]').val(day);
	$(".time-tab").removeClass('time-tab-on');
	$("li[data-date='"+day+"']").addClass('time-tab-on');
	jQuery.ajax({
		  url: timeApi,
		  type: 'GET',
		  dataType: "JSON",
		  data: {'day': day,'area': area},
		  beforeSend: function(){
			loadingDialog();
		  },
		  complete: function(xhr, textStatus) {
		    //called when complete
		    loadingDialogClose();
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
//		    times.stop();//结束上次定时器
		    //重新定时
//		    times = new Timer(".timer-container", function(){
//				 dialog({id: 'time-buckets-dialog'}).close().remove();
//			});
		    var str = '';
		    if(data.status == 1){
		    	var timeSegment = data.data.list;
                        //var firstSegment = $.isArray(timeSegment)?timeSegment[0]['id']:0;
                        var firstSegment;
                        var IndexSegment=0;
                        for(i=0;i<timeSegment.length;i++){
                            var nowtime=new Date();
                            var time = (nowtime.getHours()>9?nowtime.getHours():'0'+nowtime.getHours())+':'+(nowtime.getMinutes()>9?nowtime.getMinutes():'0'+nowtime.getMinutes());
                            var month = nowtime.getMonth()+1;
                            if((nowtime.getFullYear()+'-'+(month<10?'0'+month:month)+'-'+nowtime.getDate())==timeSegment[IndexSegment]['day']){
                                if(timeSegment[i]['endTime']>time){
                                    firstSegment = $.isArray(timeSegment)?timeSegment[i]['id']:0;
                                    IndexSegment = i;
                                    break;
                                }
                            }else{
                                firstSegment = $.isArray(timeSegment)?timeSegment[0]['id']:0;
                                IndexSegment = 0;
                            }
                        }
                        areaId = area;
                        segmentId = firstSegment;
                        select_segment_one(firstSegment, day, timeSegment[IndexSegment].startTime, timeSegment[IndexSegment].endTime,areaUrl, spacesApi, usersApi);
//		    	if(timeSegment){
//		    		$.each(timeSegment, function(index, val) {
//		    		 str += '<li class="time-buckets-radio '+(index==0?'radio-checked':'')+'" data-area="'+val['area']+'" data-segment-id="'+val['id']+'" data-beginTime="'+val['startTime']+'" data-endTime="'+val['endTime']+'" onclick="select_segment('+val['id']+',\''+day+'\',\''+val['startTime']+'\',\''+val['endTime']+'\',\''+areaUrl+'\',\''+spacesApi+'\',\''+usersApi+'\')">'+val['startTime']+' - '+val['endTime']+'</li>';
//		    		});
//		    		str += '<input type="hidden" name="segment" value="'+firstSegment+'"/>';
//		    	}else{
//					str = '<div class="no-time-segment">暂无可预约时间段</div>';
//		    	}
		    }else{
		    	str = '<div class="no-time-segment">暂无可预约时间段</div>';
		    }
		    $("#time-tab-content").html(str);
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    //弹窗提示获取区域失败
			alertDialog('网络错误，请重试  错误代码:cj13','error');
		  }
		});
}
//选择某个预约时间段
function select_segment_one(id,day,startTime,endTime,areaUrl,spacesApi,usersApi){
	$('input[name="segment"]').val(id);
	$(".time-buckets-radio").removeClass('radio-checked');
	$("li[data-segment-id='"+id+"']").addClass('radio-checked');

	//触发
    var area_id = areaId;//$('input[name="area"]').val();//获取到区域id
	var segment_id = segmentId;//$('input[name="segment"]').val();//预约是时间段
	//alert(area_id);
	if (area_id==undefined || segment_id==undefined) {
		alertDialog('请选择预约时间','error');
		return false;
	}

	if ($.isNumeric(areaUrl) && areaUrl == 2) {//非独占型空间预约
		//检查空间预约预约状态，//获取该区域下面的空间预约
		getTeamSpaces(area_id,segment_id,2,spacesApi,function(data){
			if (data.status) {
				spacesInfos = data['data']['list'][0];
				if (spacesInfos.status == 1) {
					teamBookDialog(data['data']['list'][0],segment_id,usersApi);
				}else{
					alertDialog('此时间段该空间预约，'+spacesInfos.statusName,'error');
				}

			}else{
				alertDialog('该区域无可预约空间预约  错误代码:cj14','error');
			}
		});

	}else{
		//独立型空间预约操作
		var baseUrl = areaUrl;
		if( baseUrl.indexOf('?')>0){
			 baseUrl += '&area='+area_id+'&segment='+segment_id+'&day='+day+'&startTime='+startTime+'&endTime='+endTime;
        }else{
             baseUrl =  baseUrl.replace(/\?.*$/,'')+'?'+'area='+area_id+'&segment='+segment_id+'&day='+day+'&startTime='+startTime+'&endTime='+endTime;
        }
        window.location.href = baseUrl;
	}
}

//选择某个预约时间段
function select_segment(id,day,startTime,endTime,areaUrl,spacesApi,usersApi){
	$('input[name="segment"]').val(id);
	$(".time-buckets-radio").removeClass('radio-checked');
	$("li[data-segment-id='"+id+"']").addClass('radio-checked');

	//触发
    var area_id = $('input[name="area"]').val();//获取到区域id
	var segment_id = $('input[name="segment"]').val();//预约是时间段
	//alert(area_id);
	if (area_id==undefined || segment_id==undefined) {
		alertDialog('请选择预约时间','error');
		return false;
	}

	if ($.isNumeric(areaUrl) && areaUrl == 2) {//非独占型空间预约
		//检查空间预约预约状态，//获取该区域下面的空间预约
		getTeamSpaces(area_id,segment_id,2,spacesApi,function(data){
			//console.log(data);
			if (data.status) {
				spacesInfos = data['data']['list'][0];
				if (spacesInfos.status == 1) {
					teamBookDialog(data['data']['list'][0],segment_id,usersApi);
				}else{
					alertDialog('此时间段该空间预约，'+spacesInfos.status_name,'error');
				}

			}else{
				alertDialog('该区域无可预约空间预约  错误代码:cj15','error');
			}
		});

	}else{
		//独立型空间预约操作

		var baseUrl = areaUrl;
		if( baseUrl.indexOf('?')>0){
			 baseUrl += '&area='+area_id+'&segment='+segment_id+'&day='+day+'&startTime='+startTime+'&endTime='+endTime;
        }else{
             baseUrl =  baseUrl.replace(/\?.*$/,'')+'?'+'area='+area_id+'&segment='+segment_id+'&day='+day+'&startTime='+startTime+'&endTime='+endTime;
        }
		//alert(baseUrl);
        window.location.href = baseUrl;
	}
}
/*
 * 提交预约信息
 * (url,{type,space,segment,access_token,userid,client})
 */
function books(url,query,callback){
	jQuery.ajax({
	  url: url,
	  type: 'POST',
	  dataType: 'JSON',
	  data: query,
	  beforeSend: function(){
			loadingDialog();
	  },
	  complete: function(xhr, textStatus) {
	    //called when complete
	    loadingDialogClose();
	  },
	  success: function(data, textStatus, xhr) {
	    //执行回调函数
		if(callback instanceof Function){
			callback(data);
		}
	  },
	  error: function(xhr, textStatus, errorThrown) {
	    //called when there is an error
	    alertDialog('网络错误，请重试  错误代码:cj16','error');
	  }
	});
}

//刷卡后用户检测
function checkCard(card,type,usersApi,callback){

	if(card.length == 0){
		alertDialog('请刷卡','error',1,2000);
		return false;
	}else{
		alertDialogClose();
	}

	/*loadingDialog();
	$.getJSON(usersApi+'/'+card, {},	function(json, textStatus){
		if(json.status == 1){
			//console.log(json);
			if(callback instanceof Function){
				callback(json.data.list);
			}
		}else{
			loadingDialogClose();
			alertDialog('无此卡，请联系服务台','error');
		}
	});*/
	var link=usersApi+'/'+card + '?type=card';
	if(type=='id'||type=='qr')
		link=usersApi+'/'+card;
	jQuery.ajax({
	  url: link,
	  type: 'GET',
	  dataType: 'JSON',
	  data: {},
	  beforeSend: function(){
			loadingDialog();
	  },
	  complete: function(xhr, textStatus) {
	    //called when complete
	    //loadingDialogClose();
	  },
	  success: function(data, textStatus, xhr) {
	    if(data.status == 1){
			if(callback instanceof Function){
				callback(data.data.list);
			}
		}else{
                    loadingDialogClose();
                    if(type=='qr')
			alertDialog('无效二维码，请刷新二维码后重试','error');
                    else
                        alertDialog('无此卡，请联系服务台,卡号:' + card,'error');
		}
	  },
	  error: function(xhr, textStatus, errorThrown) {
	    //called when there is an error
	    loadingDialogClose();
	    alertDialog('网络错误，请重试  错误代码:cj17','error');
	  }
	});
}
//签入
function signIn(url,user,callback){
	jQuery.ajax({
	  url: url,
	  type: 'POST',
	  dataType: 'JSON',
	  data: {'user': user,'operateChannel':1},
	  complete: function(xhr, textStatus) {
	    //called when complete
	    loadingDialogClose();
	  },
	  success: function(data, textStatus, xhr) {
	    //called when successful
	    if(callback instanceof Function){
			callback(data);
		}
	  },
	  error: function(xhr, textStatus, errorThrown) {
	    //called when there is an error
	   //alertDialog('网络错误，请重试  错误代码:cj18','error');
	   alertDialog('无法查获座位信息，请选座','error');
	  }
	});
}
//临时离开,签离
function signOutAndleaveTemp(url,book,user,space,types,callback){
	jQuery.ajax({
	  url: url,
	  type: 'POST',
	  dataType: 'JSON',
	  data: {'book': book,'user': user,'space': space,'checkType':types,'operateChannel':1},
	  beforeSend: function(){
		loadingDialog();
	  },
	  complete: function(xhr, textStatus) {
	    //called when complete
	    loadingDialogClose();
	  },
	  success: function(data, textStatus, xhr) {
	    //called when successful
	    if(callback instanceof Function){
			callback(data);
		}
	  },
	  error: function(xhr, textStatus, errorThrown) {
	    //called when there is an error
	    //alertDialog('网络错误，请重试  错误代码:cj19','error');
            alertDialog('无法查获座位信息','error');
	  }
	});
}

function changepic(){
		var captcha_img = $('#checkpic');
		var verifyimg = captcha_img.attr("src");
		captcha_img.attr('title', '点击刷新');
		captcha_img.click(function(){
		if( verifyimg.indexOf('?')>0){
        	$(this).attr("src", verifyimg+'&random='+Math.random());
    	}else{
        	$(this).attr("src", verifyimg.replace(/\?.*$/,'')+'?'+Math.random());
    	}
		});

}

//登录
document.write('<script src="/Public/assets/scripts/JQuery.md5.js" type="text/javascript"></script>');
function loginDialog(url,checkurl,callback){
	var loginDiv = '';
	loginDiv += '<div class="login_form">';
	loginDiv += '<div class="login_username"><span style="width:70px; text-align:right;">用户名：</span><input type="text" name="username" value="" placeholder="学工号"></div>';
	loginDiv += '<div class="login_pwd"><span style="width:70px; text-align:right;">密&nbsp;&nbsp;码：</span><input type="password" name="password" value="" placeholder="默认000" style="font-size:16px"></div>';
	loginDiv += '<div class="login_check"><span style="width:70px; text-align:right;float:left;margin-top:10px;">验证码：</span><input style="width:70px;float:left;margin-top:7px;" name="verify" value=""><img id="checkpic" width="70px" onclick=changepic(); class="left15" height="50" style="margin-left:8px;float:left;" alt="验证码" src="'+checkurl+'" title="点击刷新"><div style="clear:both;"></div></div>';
	loginDiv += '<div class="pswreset" style="text-align:right; padding:0;"><a href="/home/web/pswreset">忘记密码？</a></div>';
	loginDiv += '<div style="clear:both;"></div>';
    loginDiv += '</div>';
	dialog({
			'id':'login-dialog',
			'skin':'blue-dialog',
			'fixed': true,
			'title': '用户登录',
			quickClose: true,
			'content':loginDiv,
			okValue: '确定',
		    ok: function () {

						jQuery.ajax({
						  url: url,
						  type: 'POST',
						  dataType: 'JSON',
						  data: {
						  	'username': $(".login_form input[name='username']").val(),
						  	'password': hex_md5($(".login_form input[name='password']").val()),
							'verify': $(".login_form input[name='verify']").val()
						  },
						  beforeSend: function(){
							loadingDialog();
					  },
						  complete: function(xhr, textStatus) {
						    //called when complete
						    loadingDialogClose();
						  },
						  success: function(data, textStatus, xhr) {
						    //called when successful
						    if (callback instanceof Function) {
						    	callback(data);
						    }
						  },
						  error: function(xhr, textStatus, errorThrown) {
						    //called when there is an error
						    alertDialog('网络错误，请重试','error');
						  }
						});
						return false;
		    },
		    onshow:function(){
		    	if (pageTimer instanceof Object) {
					pageTimer.stop();
				}
		    },
		    onclose:function(){

		    },
		    cancelValue: '取消',
		    cancel: function () {
		    	if(typeof(pageTimerFun) != 'undefined'){
		    		pageTimerFun();
		    	}
		    }
		}).showModal();
}
//登出
function logoutDialog(url,query,callback){
	jQuery.ajax({
		  url: url,
		  type: 'POST',
		  dataType: 'JSON',
		  data: query,
		  beforeSend: function(){
			loadingDialog();
	 	  },
		  complete: function(xhr, textStatus) {
		    //called when complete
		    loadingDialogClose();
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
		    if (callback instanceof Function) {
		    	callback(data);
		    }
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    alertDialog('网络错误，请重试  错误代码:cj20','error');
		  }
		});
}
//增加团队成员
function addTeamUser(no,usersApi){
	if (!no) {
		alertDialog('请输入用户学工号','error');
		return false;
	}
	//判断有没有重复添加
	if($("li[data-id='"+no+"']").length){
		alertDialog('请不要重复添加同一人','error');
		return false;
	}
	jQuery.ajax({
	    url: usersApi + '/' + no,
	    type: 'GET',
	    dataType: 'JSON',
	    data: {},
	    beforeSend: function () {
	        loadingDialog();
	    },
	    complete: function (xhr, textStatus) {
	        //called when complete
	        loadingDialogClose();
	    },
	    success: function (data, textStatus, xhr) {
	        //called when successful
	        //console.log(data);
	        if (data.status == 1) {
	            var info = data.data.list;
	            var infoLi = '<li data-id="' + info.id + '"><i class="mem-name">' + info.name + '</i><i class="mem-del" onclick="memDel(\'' + info.id + '\')">x</i><input type="hidden" name="teamusers[]" value="' + info.id + '"/></li>';
	            $("#book_member_list ul").append(infoLi);
	        } else if (data.status == 2) {
	            alertDialog('用户已被加入黑名单', 'error');
	        } else {
	            alertDialog('该用户信息不存在', 'error');
	        }
	        $("#book_member_no").val("");
	    },
	    error: function (xhr, textStatus, errorThrown) {
	        //called when there is an error
	        alertDialog('网络错误，请重试  错误代码:cj21', 'error');
	    }
	});
}
//删除团队成员
function memDel(id){
	$("li[data-id='"+id+"']").remove();
}


//获取某天所在周几
function getDayWeek(day){
	var date = new Date(day).getDay();
	var week = ['周日','周一','周二','周三','周四','周五','周六'];
	return week[date] ? week[date]:'未知';
}

//预约规则查看
		function bookRule(bookRule){
			//var bookRule = {:json_encode(C('BOOK_DECLARE'))};
			//console.log(bookRule);
			var bookTipInfo = '';
			bookTipInfo += '<div class="bookTipInfo bookrule">';
			 $.each(bookRule, function(index,value) {
			 	 bookTipInfo += value;
			 });
			//bookTipInfo += bookRule;

			bookTipInfo += '</div>';
			//alert(bookTipInfo);
			dialog({
				'id':'book-rule-info',
				'skin':'green-dialog',
				'padding':'3%',
				'title': '预约规则',
				quickClose: true,
				'content':bookTipInfo,
				okValue: '确定',
				ok: function () {  },
				'statusbar':'<span class="timer-container" data-timer="180">180</span>',
				onshow:function(){
					timeBss = new Timer(".timer-container", function(){
					  dialog({id: 'book-rule-info'}).close().remove();
					});
			    },
			    onclose:function(){ timeBss.stop(); }
			}).showModal();
		}

//获取当前时间 YYYY-MM-dd
function getNowFormatDate(){
		var day = new Date();
		var Year = 0;
		var Month = 0;
		var Day = 0;
		var CurrentDate = "";
		//初始化时间
		//Year= day.getYear();//有火狐下2008年显示108的bug
		Year= day.getFullYear();//ie火狐下都可以
		Month= day.getMonth()+1;
		Day = day.getDate();
		//Hour = day.getHours();
		// Minute = day.getMinutes();
		// Second = day.getSeconds();
		CurrentDate += Year + "-";
		if (Month >= 10 )
		{
		CurrentDate += Month + "-";
		}
		else
		{
		CurrentDate += "0" + Month + "-";
		}
		if (Day >= 10 )
		{
		CurrentDate += Day ;
		}
		else
		{
		CurrentDate += "0" + Day ;
		}
		return CurrentDate;
}

/**
 * ***js时间日期格式化***
 *
 * 模版字符串采用严谨格式，超出则会抛出异常，且每类格式只可出现一次，如:yyyy-mm-yyyy 格式会抛异常
 *
 * y-年    length: 2/4位
 * q-季度    length: 1位
 * M-月    length: 1~2位
 * d-日    length: 1~2位
 * H-时    length: 1~2位24小时制，h：12小时制 <br>
 * m-分    length: 1~2位
 * s-秒    length: 1~2位
 * S-毫秒 length: 固定1位
 * @param {Date类型对象} date
 * @param {String类型模板字符串} fmt
 * @return 格式化后时间日期字符串
 * @author lyt
 */
function DateFormat(date, fmt){
    if (arguments.length != 2) // 参数个数校验
        throw Error('arguments长度不合法');
    if (!date || (typeof date != 'object') || (date.constructor != Date)) // 参数合法性校验
        throw Error(arguments[0] + ':类型不为Date类型');
    if (/H+/.test(fmt) && /h+/.test(fmt))
        throw Error("小时格式错误，同类型只能连续出现一次！");
    /* 模板参数校验，正则验证方法 */
    var verify = function(Rex ){
        var arr = new RegExp(Rex).exec(fmt); // 获得匹配结果数组
        if (!arr) // 匹配失败返回
            return "";
        if (fmt.split(Rex).length > 2)  // 同一类型间隔出现多次
            throw Error("fmt格式错误：同类型只能连续出现一次！");
        return arr[0];
    };
    /**
     * 提供月、天、时、分、秒通用匹配替换
     * @param {对象o属性key} r
     * @param {r对应正则对象} rex
     **/
    var common = function(r, rex) {
        if(len !=1 && len !=2)
            throw Error("月份格式错误:M只能出现1/2次");
        len == 2 ? fmt=fmt.replace(rex, o[r].length==1 ? "0"+o[r] : o[r]) : fmt=fmt.replace(rex, o[r]);
    }
    var o = { // 数据存储对象
        "y+": date.getFullYear() + "", // 年
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "M+": date.getMonth() + 1 + "", // 月
        "d+": date.getDate() + "", // 日
        "H+": date.getHours() + "", // 24时
        "h+": date.getHours() + "", // 12时
        "m+": date.getMinutes() + "", // 分
        "s+": date.getSeconds() + "", // 秒
        "S+": date.getMilliseconds() // 毫秒
    }
    for(var r in o) {
        var rex, len, temp;
        rex = new RegExp(r);
        temp = verify(rex); // 匹配所得字符串
        len = temp.length; // 长度
        if(!len || len == 0)
            continue;
        if(r == "y+") {
            if(len !=2 && len != 4)
                throw Error("年份格式错误:y只能出现2/4次");
            len == 2 ? fmt=fmt.replace(rex, o[r].substr(2,3)) : fmt=fmt.replace(rex, o[r]);
        } else if(r == "q+") {
            if(len != 1)
                throw Error("季度格式错误:q只能出现1次");
            fmt=fmt.replace(rex, o[r]);
        } else if(r == "h+") {
            if(len !=1 && len !=2)
                throw Error("小时格式错误:h只能出现1/2次");
            var h = (o[r] > 12 ? o[r]-12 : o[r]) + "";
            len == 2 ? fmt=fmt.replace(rex, h.length==1 ? "0"+h : h) : fmt=fmt.replace(rex, h);
        }  else if(r == "S+") {
            if(len != 1)
                throw Error("毫秒数格式错误:S只能出现1次");
            fmt=fmt.replace(rex, o[r]);
        }else {    // (r=="M+" || r=="d+" || r=="H+" || r=="m+" || r=="s+")
            common(r, rex)
        }
    }
    return fmt;
}
/*格式2015-05-04 21:22*/
function getNowTime(){
	  var now = new Date();

        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日

        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分

        var clock = year + "-";

        if(month < 10)
            clock += "0";

        clock += month + "-";

        if(day < 10)
            clock += "0";

        clock += day + " ";

        if(hh < 10)
            clock += "0";

        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm;
        return clock;
}
/*格式 21:22*/
function currentTime(){
		var now = new Date();

        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分

        var clock = "";

        if(hh < 10)
            clock += "0";

        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm;
        return clock;
}
function currentDay(){
  var now = new Date();

        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日

        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分

        var clock = year + "-";

        if(month < 10)
            clock += "0";

        clock += month + "-";

        if(day < 10)
            clock += "0";

        clock += day ;

        return clock;
}
/*定时器*/
function Timer(elm, onEnd){

	this.endFunc = onEnd;
	this.elm = elm;
	this.totalCount = $(elm).data("timer");
	this.count = this.totalCount;

	this.start();
}
Timer.prototype = {
		start: function(){
			var self = this;
			$(self.elm).html(self.count);

			self.timer = setTimeout(function(){
				if(self.count == 0){
					self.end();
				}else{
					self.count--;
					self.start();
				}
			}, 1000);

		},
		stop: function(){
			clearTimeout(this.timer);
			$(this.elm).html("");
		},
		end: function(){
			this.endFunc();
		},
		pause: function(){
			clearTimeout(this.timer);
		}
};
/*日期跳转*/
function jumpDayL(){
	var i;
	$(".time-tab-button-right").css("display","inline-block");
	for(i=0;i<dayNum;i++){
		if($("li.time-tab").eq(i).css("display")=="inline-block")
		{
			$("li.time-tab").eq(i-1).css("display","inline-block");
			//console.log("zhege"+i);
			if(i==1){
				$(".time-tab-button-left").css("display","none");
			}
			break;
		}
	}
	for(i=dayNum-1;i>=0;i--){
		if($("li.time-tab").eq(i).css("display")=="inline-block")
		{
			$("li.time-tab").eq(i).css("display","none");
			break;
		}
	}
}
function jumpDayR(){
	var i;
	$(".time-tab-button-left").css("display","inline");
	for(i=0;i<dayNum;i++){
		if($("li.time-tab").eq(i).css("display")=="inline-block")
		{
			$("li.time-tab").eq(i).css("display","none");
			break;
		}
	}
	for(i=dayNum-1;i>=0;i--){
		if($("li.time-tab").eq(i).css("display")=="inline-block"){
			$("li.time-tab").eq(i+1).css("display","inline-block");
			if(i+1==dayNum-1){
				$(".time-tab-button-right").css("display","none");
			}
			break;
		}
	}
}

(function($){
    $.fn.extend({
        arrayVal: function(){
            var self = $(this);
            var result = [];

            if(self.length > 0){
                self.each(function(i, o){
                    result.push($(o).val());
                });

            }
            return result;
        }
    });

})(jQuery)