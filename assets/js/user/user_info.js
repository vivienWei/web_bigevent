$(function() {

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '用户昵称不能超过6位';
            }
        }
    })

    // 调用初始化用户的基本信息函数
    initUserInfo();

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 点击重置后，把信息恢复到初始状态
        initUserInfo();
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            // 也可以利用layui的 form.val('formUserInfo');提交data
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！');
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                // 本子页面是在iframe里面的，所以下面这行代码的window指的是iframe
                window.parent.getUserInfo();
            }
        })
    })
})

var layer = layui.layer;
var form = layui.form;

// 初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户名失败！');
            }

            // $('.layui-form [name=username]').prop('placeholder', res.data.username);
            // 调用form.val() 快速为表单赋值
            form.val('formUserInfo', res.data);
        }
    })
}