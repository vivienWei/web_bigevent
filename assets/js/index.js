$(function() {
    // 调用getUserInfo 获取用户基本信息
    getUserInfo();

    // 点击按钮实现退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('是否要退出?', { icon: 3, title: '提示' }, function(index) {
            // 1.清空本地存储中的 token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            location.href = '/login.html';
            // 关闭confirm询问框
            layer.close(index);
        });

    })
})

var layer = layui.layer;

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers： 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('查看用户基本信息失败！');
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
        // 无论成功还是失败都会调用complete回调函数
        // complete: function(res) {
        //     console.log(res);
        //     // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到login
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').prop('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide();
        // 由于name是字符串，所以可以直接用name[]获取里面的字符，toUpperCase把字符变成大写
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}