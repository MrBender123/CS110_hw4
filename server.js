'use strict';
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
let todos = [

];

const todoserver = http.createServer(function (req, res) {

    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

    fs.readFile('./public' + req.url, function (err, data) {
        if(err) {
            res.statusCode = 404;
            res.end("<h1 style='text-align: center'>Dude /index.html :D</h1>")
        }
        res.statusCode = 200;
        res.end(data);
    });



    if(method === 'GET') {
        if(req.url.indexOf('/todos') === 0) {
            res.setHeader('Content-Type', 'application/json');
            let localTodos = todos;

            if(parsedQuery.searchtext) {
                localTodos = localTodos.filter(function(obj) {
                    return obj.message.indexOf(parsedQuery.searchtext) >= 0;
                });
            }
            return res.end(JSON.stringify({items : localTodos}));
        } else

        if (req.url.indexOf('/gettodos') === 0) {
            let todosforhtml = todos;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({items : todosforhtml}));
        }
    }


    if(method === 'POST') {
        if(req.url.indexOf('/todos') === 0) {
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);
                jsonObj.id = JSON.stringify(Math.random());
                todos[todos.length] = jsonObj;

                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    }


    if(method === 'PUT') {
        if(req.url.indexOf('/todos') === 0) {
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);
                for(let i = 0; i < todos.length; i++) {
                    if(todos[i].id === jsonObj.id) {
                        todos[i].completed = jsonObj.completed;
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify(todos[i]));
                    }
                }

                res.statusCode = 404;
                return res.end('Data was not found and can therefore not be updated');
            });
            return;
        }
    }


    if(method === 'DELETE') {
        if(req.url.indexOf('/todos/') === 0) {
            let id =  req.url.substr(7);
            for(let i = 0; i < todos.length; i++) {
                if(id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
});
todoserver.listen(3001);
console.log('server is running at 3001 press CTRL + C to terminate');