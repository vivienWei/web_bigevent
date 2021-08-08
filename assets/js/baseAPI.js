// 注意：每次调用$.get() 或 $.post() 或$.ajax()的时候
// 会先调用ajaxPerfilter 这个函数
// 在这个函数中，可以拿到给ajax提供的配置对象eg：data，url...
$.ajaxPrefilter(function(option) {
    // 在发起请求之前，统一拼接请求的根路径
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;
    console.log(option.url);
})