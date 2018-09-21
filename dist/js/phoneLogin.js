
//全局配置文件
config = {
    'mid': 'andbyhls', //项目id，由用户中心分配。新接的项目应向用户中心索取
}

/**
 * 封装jsonp
 * @param obj
 */
function jsonp(obj) {
    $.ajax({
        url: obj.url,
        type: 'POST',
        dataType: 'jsonp',
        async: false,
        data: obj.data,
        success: function (response) {
            obj.callback(response);
        }
    });
}



//发送手机短信验证码
function sendPhoneCode(status) {
    var phone = $('#phone').val();
    var captcha_code = $('#check_code').val();
    var url = status == 1 ? 'http://passport.2345.com/webapi/phone/sendLoginCode' : 'http://passport.2345.com/webapi/phone/sendRegCode';

    var jsonpObj={
        url:url,
        data:{phone: phone, mid: config.mid, captcha_code: captcha_code},
        callback:function (response) {
            console.log(response)
            if (response.code == 200) {
                // alert('短信验证码'+response.msg+'测试环境为123456！')
                localStorage.setItem('reg_status',status);
            } else {
                // alert(response.msg)
                $('#layer').show();
                $('#showMessage').show().siblings().hide();
                $('#tipError').text(response.msg);
                var t = setTimeout(function(){
                    $('#layer').hide();
                },1000)
            }
        },
    }
    jsonp(jsonpObj);
}


//发送手机短信验证码
function getLoginUrl(status) {
    var phone = $('#phone').val();
    var verify_code = $('#verify_code').val();
    var autoLogin = $('#autoLogin').val();
    var vTime = $('#autoLogin').val() == 'on' ? 3600 * 24 * 7 : 0;//0--代表默认cookie失效时间
    var url = status == 1 ? 'http://passport.2345.com/webapi/phone/login' : 'http://passport.2345.com/webapi/phone/quickReg';

    var jsonpObj={
        url:url,
        data:{phone: phone, mid: config.mid, verify_code: verify_code, vTime: vTime, autoLogin: autoLogin},
        callback:function (response) {
            console.log(response)
            if (response.code == 200) {
                setSsoCookie(response.data.loadPage)
            } else {
                // alert(response.msg)
                $('#layer').show();
                $('#showMessage').show().siblings().hide();
                $('#tipError').text(response.msg);
                var t = setTimeout(function(){
                    $('#layer').hide();
                },1000)
            }
        },
    }
    jsonp(jsonpObj);

}



//设置单点登录信息
function setSsoCookie(loadPage) {
    var loadObj = loadPage;
    var loadLen = loadObj.length;
    var loadCount = 0;
    for (var loadIndex in  loadObj) {
        $.getScript(loadObj[loadIndex], function () {
            ++loadCount;
            if (loadCount == loadLen) {
                window.history.back();
                alert('登录成功!登录cookie可查看I或者调用相关登录信息查询接口')
            }
        });

    }
}


/**
 * 获取短信验证码
 */
function getCode() {
    var phone = $('#phone').val();
    var check_code = $('#check_code').val();
    var jsonpObj={
        url:'http://passport.2345.com/webapi/check/phoneStatus',
        data:{phone: phone, mid: config.mid, check_code: check_code},
        callback:function (response) {
            console.log(response)
            if (response.code == 200) {
                sendPhoneCode(response.data.status)
            } else {
                // alert(response.msg)
                $('#layer').show();
                $('#showMessage').show().siblings().hide();
                $('#tipError').text(response.msg);
                var t = setTimeout(function(){
                    $('#layer').hide();
                },1000)
            }
        },
    }
    jsonp(jsonpObj);
}

//单点登录
function login(){
    getLoginUrl(localStorage.getItem('reg_status'))
}






// 图形验证码
function getPicCode(){
    $('#layer').show();
    $('#showPicCode').show().siblings().hide();
}

$('.btn-cancel').on('click',function(){
    $(this).parents('showPicCode').hide();
    $('#layer').hide();
})



$('#J_checkPicCode').on('click',function(){
    // localStorage.setItem('captcha_code',$('#check_code').val())
    $(this).parents('showPicCode').hide();
    $('#layer').hide();
    countdown();
    getCode();
})



function countdown(){
  // 验证码倒计时
  var seconds = 60;
  $('#btnGetPicCode').html('重新获取' + seconds).addClass('countdown');
  timer = setInterval(function() {
      seconds -= 1;
      if (seconds > 0) {
          $('#btnGetPicCode').html('重新获取' + seconds);
      } else {
          clearInterval(timer)
          $('#btnGetPicCode').html('获取验证码').removeClass('countdown');
      }
  }, 1000)
}


// 完善信息
function completeInfo(){
    var phone = $('#phone').val();
    var captcha_code = $('#check_code').val();
    var url = 'http://h5.2345.com/Buyu/User/AddInfo';
    var userName = $('#username').val();
    var userID = $('#userID').val();

    var jsonpObj={
        url:url,
        data:{phone: phone, mid: config.mid, captcha_code: captcha_code, userName, userID},
        callback:function (response) {
            console.log(response)
        },
    }
    jsonp(jsonpObj);    
}

$('#J_submitComplete').on('click',function(){
    login();
    completeInfo();
})

$('.goback').on('click',function(){
    window.history.back();
})