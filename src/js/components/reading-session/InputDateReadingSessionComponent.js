import React from 'react';
import PropTypes from 'prop-types';
import localizer from 'utils/Localizer';

function InputDateReadingSessionComponent(props) {
    const { dateReadingSession, operation, onInputChange, onAddButtonClick, onUpdateButtonClick, onCancelButtonClick } = props;
    return (
        <div className="entry">
            <input type="date"
                   name="date"
                   className="text"
                   placeholder={localizer.localize('date-reading-session-date-text')}
                   value={dateReadingSession.date ? dateReadingSession.date : ""}
                   onChange={onInputChange}
                   readOnly={operation !== 'add'}/>
            <input type="text"
                   name="lastReadPage"
                   className="text"
                   placeholder={localizer.localize('date-reading-session-last-read-page-text')}
                   value={dateReadingSession.lastReadPage ? dateReadingSession.lastReadPage : ""}
                   onChange={onInputChange}/>
            <input type="text"
                   name="bookmark"
                   className="text"
                   placeholder={localizer.localize('date-reading-session-bookmark-text')}
                   value={dateReadingSession.bookmark ? dateReadingSession.bookmark : ""}
                   onChange={onInputChange}/>

            {operation === 'add' ? (
            <button className="button"
                    onClick={() => onAddButtonClick(dateReadingSession)}>
                {localizer.localize('date-reading-session-add-button')}
            </button>
            ) : (
            <button className="button"
                    onClick={() => onUpdateButtonClick(dateReadingSession)}>
                {localizer.localize('date-reading-session-update-button')}
            </button>
            )}
            <button className="button"
                    onClick={onCancelButtonClick}>
                {operation === 'add' ? localizer.localize('clear') : localizer.localize('cancel')}
            </button>
        </div>
    );
}

InputDateReadingSessionComponent.propTypes = {
    operation: PropTypes.oneOf(['add', 'edit']).isRequired,
    dateReadingSession: PropTypes.shape({
        date: PropTypes.string,
        lastReadPage: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        bookmark: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    }),
    onInputChange: PropTypes.func,
    onAddButtonClick: PropTypes.func,
    onUpdateButtonClick: PropTypes.func,
    onCancelButtonClick: PropTypes.func
};

export default InputDateReadingSessionComponent;