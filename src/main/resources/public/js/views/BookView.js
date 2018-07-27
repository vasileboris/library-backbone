import _ from 'underscore';
import Backbone from 'backbone';
import BooksDispatcher from 'events/BooksDispatcher';
import localizer from 'utils/Localizer';
import urlUtil from 'utils/UrlUtil';
import templateHtml from 'text!templates/Book.html';
import history from 'routers/History';

const BookView = Backbone.View.extend({
    tagName: 'article',

    className: 'result-book',

    template: _.template(templateHtml),

    events: {
        'click .edit-item': 'editBook',
        'click .read-item': 'readBook',
        'click .delete-item': 'deleteBook'
    },

    initialize: function (book) {
        this.book = book;
        this.listenTo(this.book, 'change', this.render);
    },

    render: function () {
        this.$el.html(this.template({
            book: this.book.attributes,
            localizer: localizer,
            urlUtil: urlUtil
        }));
        return this;
    },

    editBook: function (e) {
        e.preventDefault();
        BooksDispatcher.trigger(BooksDispatcher.Events.ERROR, '');
        BooksDispatcher.trigger(BooksDispatcher.Events.EDIT, this.book);
    },

    readBook: function (e) {
        e.preventDefault();
        history.push('/books/' + this.book.get('uuid'));
    },

    deleteBook: function (e) {
        e.preventDefault();
        BooksDispatcher.trigger(BooksDispatcher.Events.ERROR, '');
        this.book.destroy()
            .then(() => this.remove())
            .catch(error => this.errorOnDeleteBook(error));
    },

    errorOnDeleteBook: function (error) {
        const message = localizer.localize('book-delete-error', error.status);
        BooksDispatcher.trigger(BooksDispatcher.Events.ERROR, message);
    }
});

export default BookView;