const http = require('http');
const url = require('url');

const host = "localhost";
const port = 8000;

var books = [];

function handleRequest(request, response) {

    // switch between two types of requests:
    // 1. get all books
    // 2. add a book to the list
    response.writeHead(200);

    if (request.method === 'POST') {
        
        // get the body from the request
        // the from the request will correspond to a book
        // add the book to our array
        // send a response back to the client application

        var body = "";
        request.on('data', chunk => {
            body += chunk.toString();
        });
        
        request.on('end', () => {
            var book = JSON.parse(body);
            books.push(book);
    
            response.writeHead(201);
            response.end("");
        })

    } else if (request.method === 'GET') {
        var queryParameters = url.parse(request.url).query;

        if (queryParameters == null) {
            // return all the books
            response.write(JSON.stringify(books));
            response.end("");
        } else {
            // split query parameters in a pair of name, value
            var name = queryParameters.split("=")[0];
            var value = queryParameters.split("=")[1];

            if (name !== 'author') {
                response.writeHead(404);
                response.end("Not found! Wrong query string parameter!");
            }

            // filter our books  based on the query string parameter
            var filteredBooksList = books.filter(book => book.author === value);

            response.writeHead(200);
            response.end(JSON.stringify(filteredBooksList));
        }

    }
}

const server = http.createServer(handleRequest);
server.listen(port, host);