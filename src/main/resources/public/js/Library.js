$(function() {
    "use strict";

    if(window.bookcase === undefined) {
        window.bookcase = {};
    }

    bookcase.booksView = new bookcase.BooksView();

});
