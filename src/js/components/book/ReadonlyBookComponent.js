import React from 'react';
import localizer from 'utils/Localizer';
import BookFigureComponent from './BookFigureComponent';
import PropTypes from 'prop-types';

function ReadonlyBookComponent(props) {
    const { book } = props;
    if(!book) {
        return null;
    }
    return (
        <article className="result-single">
            <BookFigureComponent book={book} size="large"/>
            <div>{localizer.localize('book-by-label')} {book.authors.join(', ')}</div>
            <div>{book.pages} {localizer.localize('book-pages-label')}</div>
        </article>
    );
}

ReadonlyBookComponent.propTypes = {
    book: PropTypes.shape({
        authors: PropTypes.arrayOf(PropTypes.string).isRequired,
        pages: PropTypes.number.isRequired
    })
};

export default ReadonlyBookComponent;