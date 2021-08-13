$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormate = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        y = addZero(y);
        var m = dt.getMonth() + 1;
        m = addZero(m);
        var d = dt.getDate();
        d = addZero(d);

        var hh = dt.getHours();
        hh = addZero(hh);
        var mm = dt.getMinutes();
        mm = addZero(mm);
        var ss = dt.getSeconds();
        ss = addZero(ss);

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 补0
    function addZero(value) {
        return value = value < 10 ? '0' + value : value;
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    };

    initTable();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！');
                }
                console.log(res);

                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                // 渲染页面
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域的UI结构
                // 原本导入的lauyui里面的是个空的，调用模板引擎之后layui.js
                // 也是看不到的，因此要渲染
                form.render();
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var id = $('[name=cate_id').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的id  
            count: total, //总数据总数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候触发 jump回调
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，会触发jump回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            // 因此用jump方法的第二个参数first判断jump回调的方式是哪一种
            jump: function(obj, first) {
                // 可以通过first的值，来判断是通过哪种方式，触发的jump回调
                // 如果first的值为true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first);
                console.log(obj.curr);
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染
                // 直接在这里写这行，陷入死循环
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $(this).length;
        console.log(len);

        // 弹出提示框：询问用户是否需要删除数据
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + $(this).attr('data-id'),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 会存在bug，如删除完最后一页数据，不会把页码显示为前一页有数据的
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据，则让页码值-1之后，再重新调用initTable()方法
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // q.pagenum = q.pagenum - 1;
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });

    })




})