// 注意：每次调用$.get() 或 $.post() 或$.ajax()的时候
// 会先调用ajaxPerfilter 这个函数
// 在这个函数中，可以拿到给ajax提供的配置对象eg：data，url...
$.ajaxPrefilter(function(options) {
    // 在发起请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一为有权限的接口，设置headers请求头
    // 用indexOf查找指定子字符串，无则返回-1
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        };
    }

    // 全局统一挂载  complete 回调函数
    options.complete = function(res) {
        // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制跳转到login
            location.href = '/login.html';
        }
    }

})