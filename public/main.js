'use strict';

let $ui = $('#ui');
let $searchbox = $('#searchtxtbx');
let $messagebox = $('#msgtxtbx');


const htmltodo = function (todo) {
    $ui.append('<li class ="todostyle">' + todo.message + '</li>');
    $ui.append('<button class = "remove" data-id="'+todo.id+'">X</button>');
    $ui.append('<input type = "checkbox" class="checkbox" data-id="'+todo.id+'" data-status="'+todo.completed+'">');
};
const checked = function () {
    $('.checkbox').each(function () {
        if ($(this).attr('data-status') === 'true') {
            $(this).attr('checked', 'checked');
        }
    });
};

const edit = function (completed, todo) {
    let complete = false;
    if (completed === 'false') {
        complete = true;
    }
    let status = {
        completed: complete,
        id: todo
    };
    $.ajax({
        url         : "/todos/" + todo,
        type        : 'put',
        dataType    : 'json',
        data        : JSON.stringify(status),
        contentType : "application/json; charset=utf-8",
        error       : function() {
            alert('Error updating todo');
        }
    });
};

$(document).ready(function ($) {
    $.ajax({
        url : "/gettodos",
        type : 'get',
        dataType : 'json',
        success : function (data) {
            $.each(data.items, function (i, todo) {
                htmltodo(todo);
                checked();
            });
        },
        error : function () {
            alert('Error');
        }
    });

    $('#searchbutton').on('click', function () {
        const searchtext = $searchbox.val();
        $.ajax({
            url      : "/todos",
            type     : 'get',
            dataType : 'json',
            data     : {
                searchtext : searchtext
            },
            success  : function(data) {
                $ui.html('');
                $.each(data.items, function(i, todo) {
                    htmltodo(todo);
                    checked();
                    $searchbox.val('');
                });
            },
            error    : function() {
                alert('No Matches Found');
            }
        });
    });

    $('#create').on('click', function () {
        let text = $messagebox.val();
        if (text === '') {
            alert('please input the task you want to accomplish');
        } else
            $.ajax({
                url         : "/todos",
                type        : 'post',
                dataType    : 'json',
                data        : JSON.stringify({
                    message   : text,
                    completed : false
                }),
                contentType : "application/json; charset=utf-8",
                success     : function(data) {
                    htmltodo(data);
                },
                error       : function() {
                    alert('Error creating todo');
                }
            });
        $messagebox.val('');
    });

    $ui.on('click', '.remove', function () {
        let element = $(this);
        $.ajax({
            url     : "/todos/" + $(this).attr('data-id'),
            type    : 'delete',
            success : function() {
                element.next().remove();
                element.prev().remove();
                element.remove();
            },
            error   : function() {
                alert('Error deleting the item');
            }
        });
    });

    $ui.on('click', '.checkbox', function () {
        let status = $(this).attr('data-status');
        edit(status, $(this).attr('data-id'));
    });
});