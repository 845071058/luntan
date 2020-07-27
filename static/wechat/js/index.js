var userId = getCookie('userId')
var appId = 'ww6acf410d84945b8a'
var PROTOCOL = window.location.protocol
var HOSTNAME = window.location.hostname
var url = HOSTNAME + ':8002/static/wechat/base.html'
// var url = HOSTNAME + '/static/wechat/base.html'
var timestamp = "";
var signature = "";

if (!userId || userId == 'undefined') {
	window.location.href =
		"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
		appId +
		"&redirect_uri=" +
		url +
		"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
}

function initDate(datar, type) {
	let Hours = new Date(datar).getHours();
	if (Hours < 10) {
		Hours = '0' + Hours
	}
	let Minutes = new Date(datar).getMinutes();
	if (Minutes < 10) {
		Minutes = '0' + Minutes
	}
	if (type == 1) {
		return new Date(datar).getFullYear() + '-' + (new Date(datar).getMonth() + 1) + '-' + new Date(datar).getDate() + ' ' +
			Hours + ':' + Minutes
	} else {
		return new Date(datar).getFullYear() + '-' + (new Date(datar).getMonth() + 1) + '-' + new Date(datar).getDate()
	}
}
var canSend
var timer = null;

function isVaildPhone(str) {
	const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
	return reg.test(str);
}
$(function() {
	var flowList;
	$.ajax({
		url: host + '/auth/auth/user/getIdByWXuserid?userId=' + userId,
		dataType: 'json',
		success: function(res) {
			if (res.data.id) {
				$.ajax({
					url: host + '/tss/api/flow/getMySub?pageNumber=&pageSize=&userId=' + res.data.id,
					dataType: 'json',
					success: function(objs) {
						if (objs.data.result.length > 0) {
							var html = '';
							flowList = objs.data.result
							for (var i = 0; i < flowList.length; i++) {
								var exploit = flowList[i]
								html += '<div class="approvalList-item" data-id="' + exploit.id + '" data-key="' + exploit.business_key +
									'" data-type="' + exploit.flow_typeid +
									'">' +
									'<h5>' + exploit.flow_title + '</h5>' +
									'<div class="approvalList-item_data">' +
									'<div class="box">' +
									'<p><span>创建人：</span>' + exploit.submit_man + '</p>' +
									'</div>' +
									'<div class="box">' +
									'<p><span>提交时间：</span>' + initDate(exploit.submit_time) + '</p>' +
									'</div>' +
									'<div class="box">' +
									'<p><span>流程类型：</span>' + exploit.flow_type + '</p>' +
									'</div>' +
									'</div>' +
									'</div>'
							}
							$('.approvalList').html(html);
							$('.approvalList .approvalList-item').on('click', function() {
								var type = $(this).data('type')
								var flowId = $(this).data('id')
								var flowKey = $(this).data('key')

								$.ajax({
									url: host + '/tss/api/flow/getDetialByType?typeId=' + type + '&businessId=' + flowKey,
									dataType: 'json',
									success: function(res) {
										var flowObj = res.data;
										$.ajax({
											url: host + "/tss/WeiXinService?pageUrl=" + PROTOCOL + '//' + HOSTNAME +
												':8002/static/wechat/approvalList.html',
											async: false,
											success: function(data) {
												var obj = $.parseJSON(data)
												timestamp = obj.timstamp;
												signature = obj.signature;
												wx.config({
													beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
													debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
													appId: 'ww6acf410d84945b8a', // 必填，企业微信的corpID
													timestamp: timestamp, // 必填，生成签名的时间戳
													nonceStr: 'jytxqiyeweixintest', // 必填，生成签名的随机串
													signature: signature, //必填，签名，见附录1
													jsApiList: ['checkJsApi',
														'onMenuShareAppMessage',
														'onMenuShareWechat',
														'onMenuShareTimeline',
														'thirdPartyOpenPage'
													] //必填，需要使用的JS接口列表，所有JS接口列表见附录2
												});
											}
										});
										wx.ready(function() {
											// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
											//alert("wx.config 验证成功！timestamp:" + timestamp + ":signature=" + signature);
											//验证 agent config
											$.ajax({
												url: host + "/tss/WeiAppService?timestamp=" + timestamp + "&pageUrl=" + PROTOCOL + '//' +
													HOSTNAME +
													':8002/static/wechat/approvalList.html',
												async: false,
												success: function(data) {
													var obj = $.parseJSON(data);
													signature = obj.signature;
													var thirdNo = (new Date()).getTime();
													wx.agentConfig({
														corpid: 'ww6acf410d84945b8a', // 必填，企业微信的corpid，必须与当前登录的企业一致
														agentid: '1000002', // 必填，企业微信的应用id
														timestamp: timestamp, // 必填，生成签名的时间戳
														nonceStr: 'jytxqiyeweixintest', // 必填，生成签名的随机串
														signature: signature, // 必填，签名，见附录1
														jsApiList: ['thirdPartyOpenPage',
															'selectExternalContact'
														], //必填
														success: function(res) {
															// 回调
															var fieldListArr;
															var cuState = flowObj.state == '1' ? '电话沟通' : flowObj.state == '2' ? '上门拜访' :
																flowObj.state ==
																'3' ? '协商谈判' : flowObj.state == '4' ? '准备投标' : '已完成'
															if (type == '1') {
																fieldListArr = [{
																		'title': '计划标题',
																		'type': 'text',
																		'value': flowObj.title,
																	},
																	{
																		'title': '客户状态',
																		'type': 'text',
																		'value': cuState,
																	},
																	{
																		'title': '计划时间',
																		'type': 'text',
																		'value': initDate(flowObj.gr_plan_date),
																	},
																	{
																		'title': '拜访人',
																		'type': 'text',
																		'value': flowObj.person_name,
																	},
																	{
																		'title': '联系方式',
																		'type': 'text',
																		'value': flowObj.person_phone,
																	},
																	{
																		'title': '拜访地址',
																		'type': 'text',
																		'value': flowObj.address,
																	},
																	{
																		'title': '拜访目的',
																		'type': 'text',
																		'value': flowObj.target,
																	},
																	{
																		'title': '备注',
																		'type': 'text',
																		'value': flowObj.update_reason,
																	}
																]
															} else {
																fieldListArr = [{
																		'title': '方案名称',
																		'type': 'text',
																		'value': flowObj.name,
																	},
																	{
																		'title': '报价价格',
																		'type': 'text',
																		'value': "" + flowObj.price + "",
																	},
																	{
																		'title': '预期收益',
																		'type': 'text',
																		'value': "" + flowObj.expected_return + "",
																	},
																	{
																		'title': '报价日期',
																		'type': 'text',
																		'value': initDate(flowObj.datime),
																	},
																	{
																		'title': '签约信息',
																		'type': 'text',
																		'value': flowObj.price_desc,
																	},
																	{
																		'title': '空间分析',
																		'type': 'text',
																		'value': flowObj.space_analysis,
																	},
																	{
																		'title': '风险分析',
																		'type': 'text',
																		'value': flowObj.risk_analysis,
																	},
																	{
																		'title': '客户反馈',
																		'type': 'text',
																		'value': flowObj.feedback,
																	}
																]
															}
															wx.invoke('thirdPartyOpenPage', {
																	"oaType": "10001", // String
																	"templateId": "" + flowObj.wxTempId + "", // String
																	"thirdNo": "" + flowId + "", // String
																	"extData": {
																		'fieldList': fieldListArr
																	} // JSON
																},
																function(res) {
																	// 输出接口的回调信息
																	// alert(JSON.stringify(res));
																});
														},
														fail: function(res) {
															if (res.errMsg.indexOf('function not exist') > -1) {
																alert('版本过低请升级');
															}
														}
													});
												}
											});
										});
									}
								})
							})
						}
					}
				})
			} else {
				$('.loginBox').show();
				$('.codeSign').on('click', function() {
					if (canSend) {
						return
					}
					var phone = $('#phoneVal').val();
					if (!phone) {
						alert('请输入手机号码！')
						return;
					}
					if (!isVaildPhone(phone)) {
						alert('手机号码不正确！')
						return;
					}
					$.ajax({
						url: host + '/tss/api/smsserverOut/sendCode',
						contentType: "application/json; charset=utf-8",
						type: "post",
						data: JSON.stringify({
							'recipient': phone
						}),
						dataType: 'json',
						success: function(res) {
							var times = 60;
							clearInterval(timer);
							timer = setInterval(() => {
								times--;
								if (times <= 0) {
									$('.codeSign').text('获取验证码')
									clearInterval(timer);
									canSend = false;
									times = 60;
								} else {
									var text = times + '秒后重试'
									$('.codeSign').text(text)
									canSend = true;
								}
							}, 1000);
						},
						error: function(res) {
							alert(JSON.stringify(res));
						}
					})
				})
				$('.but').on('click', function() {
					var phone = $('#phoneVal').val();
					var code = $('#codeVal').val();
					if (!phone) {
						alert('请输入手机号码！')
						return;
					}
					if (!isVaildPhone(phone)) {
						alert('手机号码不正确！')
						return;
					}
					$.ajax({
						url: host + '/auth/auth/user/bindUserId?phone=' + phone + '&wxUserId=' + userId + '&vailCode=' + code,
						type: 'get',
						dataType: 'json',
						success: function(res) {
							if (res.success) {
								alert(res.data.id)
								$('.loginBox').hide();
								$.ajax({
									url: host + '/tss/api/flow/getMySub?pageNumber=&pageSize=&userId=' + res.data.id,
									dataType: 'json',
									success: function(objs) {
										if (objs.data.result.length > 0) {
											var html = '';
											flowList = objs.data.result
											for (var i = 0; i < flowList.length; i++) {
												var exploit = flowList[i]
												html += '<div class="approvalList-item" data-id="' + exploit.id + '" data-key="' + exploit.business_key +
													'" data-type="' + exploit.flow_typeid +
													'">' +
													'<h5>' + exploit.flow_title + '</h5>' +
													'<div class="approvalList-item_data">' +
													'<div class="box">' +
													'<p><span>创建人：</span>' + exploit.submit_man + '</p>' +
													'</div>' +
													'<div class="box">' +
													'<p><span>提交时间：</span>' + initDate(exploit.submit_time) + '</p>' +
													'</div>' +
													'<div class="box">' +
													'<p><span>流程类型：</span>' + exploit.flow_type + '</p>' +
													'</div>' +
													'</div>' +
													'</div>'
											}
											$('.approvalList').html(html);
											$('.approvalList .approvalList-item').on('click', function() {
												var type = $(this).data('type')
												var flowId = $(this).data('id')
												var flowKey = $(this).data('key')
												$.ajax({
													url: host + '/tss/api/flow/getDetialByType?typeId=' + type + '&businessId=' + flowKey,
													dataType: 'json',
													success: function(res) {
														var flowObj = res.data;
														$.ajax({
															url: host + "/tss/WeiXinService?pageUrl=" + PROTOCOL + '//' + HOSTNAME +
																':8002/static/wechat/approvalList.html',
															async: false,
															success: function(data) {
																var obj = $.parseJSON(data)
																timestamp = obj.timstamp;
																signature = obj.signature;
																wx.config({
																	beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
																	debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
																	appId: 'ww6acf410d84945b8a', // 必填，企业微信的corpID
																	timestamp: timestamp, // 必填，生成签名的时间戳
																	nonceStr: 'jytxqiyeweixintest', // 必填，生成签名的随机串
																	signature: signature, //必填，签名，见附录1
																	jsApiList: ['checkJsApi',
																		'onMenuShareAppMessage',
																		'onMenuShareWechat',
																		'onMenuShareTimeline',
																		'thirdPartyOpenPage'
																	] //必填，需要使用的JS接口列表，所有JS接口列表见附录2
																});
															}
														});
														wx.ready(function() {
															// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
															//alert("wx.config 验证成功！timestamp:" + timestamp + ":signature=" + signature);
															//验证 agent config
															$.ajax({
																url: host + "/tss/WeiAppService?timestamp=" + timestamp + "&pageUrl=" + PROTOCOL +
																	'//' +
																	HOSTNAME +
																	':8002/static/wechat/approvalList.html',
																async: false,
																success: function(data) {
																	var obj = $.parseJSON(data);
																	signature = obj.signature;
																	var thirdNo = (new Date()).getTime();
																	wx.agentConfig({
																		corpid: 'ww6acf410d84945b8a', // 必填，企业微信的corpid，必须与当前登录的企业一致
																		agentid: '1000002', // 必填，企业微信的应用id
																		timestamp: timestamp, // 必填，生成签名的时间戳
																		nonceStr: 'jytxqiyeweixintest', // 必填，生成签名的随机串
																		signature: signature, // 必填，签名，见附录1
																		jsApiList: ['thirdPartyOpenPage',
																			'selectExternalContact'
																		], //必填
																		success: function(res) {
																			// 回调
																			var fieldListArr;
																			var cuState = flowObj.state == '1' ? '电话沟通' : flowObj.state == '2' ?
																				'上门拜访' :
																				flowObj.state ==
																				'3' ? '协商谈判' : flowObj.state == '4' ? '准备投标' : '已完成'
																			if (type == '1') {
																				fieldListArr = [{
																						'title': '计划标题',
																						'type': 'text',
																						'value': flowObj.title,
																					},
																					{
																						'title': '客户状态',
																						'type': 'text',
																						'value': cuState,
																					},
																					{
																						'title': '计划时间',
																						'type': 'text',
																						'value': initDate(flowObj.gr_plan_date),
																					},
																					{
																						'title': '拜访人',
																						'type': 'text',
																						'value': flowObj.person_name,
																					},
																					{
																						'title': '联系方式',
																						'type': 'text',
																						'value': flowObj.person_phone,
																					},
																					{
																						'title': '拜访地址',
																						'type': 'text',
																						'value': flowObj.address,
																					},
																					{
																						'title': '拜访目的',
																						'type': 'text',
																						'value': flowObj.target,
																					},
																					{
																						'title': '备注',
																						'type': 'text',
																						'value': flowObj.update_reason,
																					}
																				]
																			} else {
																				fieldListArr = [{
																						'title': '方案名称',
																						'type': 'text',
																						'value': flowObj.name,
																					},
																					{
																						'title': '报价价格',
																						'type': 'text',
																						'value': "" + flowObj.price + "",
																					},
																					{
																						'title': '预期收益',
																						'type': 'text',
																						'value': "" + flowObj.expected_return + "",
																					},
																					{
																						'title': '报价日期',
																						'type': 'text',
																						'value': initDate(flowObj.datime),
																					},
																					{
																						'title': '签约信息',
																						'type': 'text',
																						'value': flowObj.price_desc,
																					},
																					{
																						'title': '空间分析',
																						'type': 'text',
																						'value': flowObj.space_analysis,
																					},
																					{
																						'title': '风险分析',
																						'type': 'text',
																						'value': flowObj.risk_analysis,
																					},
																					{
																						'title': '客户反馈',
																						'type': 'text',
																						'value': flowObj.feedback,
																					}
																				]
																			}
																			wx.invoke('thirdPartyOpenPage', {
																					"oaType": "10001", // String
																					"templateId": "" + flowObj.wxTempId + "", // String
																					"thirdNo": "" + flowId + "", // String
																					"extData": {
																						'fieldList': fieldListArr
																					} // JSON
																				},
																				function(res) {
																					// 输出接口的回调信息
																					// alert(JSON.stringify(res));
																				});
																		},
																		fail: function(res) {
																			if (res.errMsg.indexOf('function not exist') > -1) {
																				alert('版本过低请升级');
																			}
																		}
																	});
																}
															});
														});
													}
												})
											})
										}
									}
								})
							} else {
								alert(res.msg)
							}
						}
					})
				})
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("网络出错1");
		},
		fail: function(jqXHR, textStatus, errorThrown) {
			// net::ERR_CONNECTION_REFUSED 发生时，也能进入
			alert("网络出错");
		}
	})

	// 	wx.error(function(res) {
	// 		// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
	// 		alert(res.errMsg)
	// 	});
})
