$(function() {
    // 调用获取文章分类列表
    initArtCateList();

    var layer = layui.layer;
    var form = layui.form;

    // 为添加列表按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 这行代码是获取html结构的
            content: $('#dialog-add').html()
        });
    })

    // 因为添加文章分类表单是动态创建的，因此不能直接获取
    // 通过代理的形式，为form-add表单绑定submit事件，要绑定一个页面中存在的元素
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('增加文章分类失败！');
                }
                initArtCateList();
                layer.msg('增加文章分类成功！');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);

            }
        })

    })

    var indexEdit = null;
    // 通过代理的形式，为btn-edit表单绑定submit事件，
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 这行代码是获取html结构的
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
                console.log(res);
            }
        })

    })

    // 通过代理的形式，为修改分类的表单绑定 submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: form.val('form-edit'),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                initArtCateList();
                layer.close(indexEdit);
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + $(this).attr('data-id'),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })

        });

    })

})



// 获取文章分类的列表
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            var htmlStr = template('tpl-table', res);
            $('tbody').html(htmlStr);
        }
    })
}