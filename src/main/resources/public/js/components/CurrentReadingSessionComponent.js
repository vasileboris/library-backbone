import React from 'react';
import PropTypes from 'prop-types';
import localizer from 'utils/Localizer';
import DateReadingSessions from 'collections/DateReadingSessions';
import ReadonlyBookComponent from 'components/ReadonlyBookComponent';
import ReadingSessionProgressComponent from 'components/ReadingSessionProgressComponent'
import MessageComponent from 'components/MessageComponent';
import DateReadingSessionsComponent from 'components/DateReadingSessionsComponent';
import InputDateReadingSessionComponent from 'components/InputDateReadingSessionComponent';
import DateReadingSession from 'models/DateReadingSession';
import { fetchBook } from 'api/BookApi';
import { fetchCurrentReadingSession } from 'api/ReadingSessionApi';
import { fetchCurrentReadingSessionProgress } from 'api/ReadingSessionProgressApi';

class CurrentReadingSessionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            operation: 'add',
            dateReadingSession: {}
        };
        this.successOnRetrieveCurrentReadingSession = this.successOnRetrieveCurrentReadingSession.bind(this);
        this.errorOnRetrieveCurrentReadingSession = this.errorOnRetrieveCurrentReadingSession.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onAddButtonClick = this.onAddButtonClick.bind(this);
        this.errorOnValidateDateReadingSession = this.errorOnValidateDateReadingSession.bind(this);
        this.successOnAddDateReadingSession = this.successOnAddDateReadingSession.bind(this);
        this.errorOnAddDateReadingSession = this.errorOnAddDateReadingSession.bind(this);
        this.onEditDateReadingSessionClick = this.onEditDateReadingSessionClick.bind(this);
        this.onUpdateButtonClick = this.onUpdateButtonClick.bind(this);
        this.successOnUpdateDateReadingSession = this.successOnUpdateDateReadingSession.bind(this);
        this.errorOnUpdateDateReadingSession = this.errorOnUpdateDateReadingSession.bind(this);
        this.onDeleteDateReadingSessionClick = this.onDeleteDateReadingSessionClick.bind(this);
    }

    render() {
        return (
            <div>
                <div className="results">
                    {this.state.book ? (
                        <ReadonlyBookComponent book={this.state.book}/>
                    ) : null }
                    {this.state.readingSessionProgress ? (
                        <ReadingSessionProgressComponent readingSessionProgress={this.state.readingSessionProgress}/>
                    ) : null}
                </div>
                {this.state.message ? (
                    <MessageComponent message={this.state.message}/>
                ) : null}
                <InputDateReadingSessionComponent
                    operation={this.state.operation}
                    dateReadingSession={this.state.dateReadingSession}
                    onInputChange={this.onInputChange}
                    onAddButtonClick={this.onAddButtonClick}
                    onUpdateButtonClick={this.onUpdateButtonClick}/>
                {this.state.dateReadingSessions ? (
                    <DateReadingSessionsComponent
                        dateReadingSessions={this.state.dateReadingSessions}
                        onEditClick={this.onEditDateReadingSessionClick}
                        onDeleteClick={this.onDeleteDateReadingSessionClick}/>
                ) : null}
            </div>
        );
    }

    componentDidMount() {
        this.retrieveBook();
        this.retrieveCurrentReadingSession();
    }

    componentWillUnmount() {
        console.log('Moving away from react!')
    }

    retrieveBook() {
        fetchBook(this.props.bookUuid)
            .then(response => this.successOnRetrieveBook(response.data))
            .catch(error => this.errorOnRetrieveBook(error));
    }

    successOnRetrieveBook(book) {
        this.setState({
            book
        });
    }

    errorOnRetrieveBook(error) {
        this.setState({
            message: localizer.localize('book-retrieve-error', error.response.status)
        });
    }

    retrieveCurrentReadingSession() {
        fetchCurrentReadingSession(this.props.bookUuid)
            .then(response => this.successOnRetrieveCurrentReadingSession(response.data))
            .catch(error => this.errorOnRetrieveCurrentReadingSession(error));
    }

    successOnRetrieveCurrentReadingSession(currentReadingSession) {
        this.setState({
            currentReadingSession
        });
        this.retrieveReadingSessionProgress();
        this.retrieveDateReadingSessions();
    }

    errorOnRetrieveCurrentReadingSession(error) {
        this.setState({
            message: localizer.localize('reading-session-retrieve-error', error.response.status)
        });
    }

    retrieveReadingSessionProgress() {
        fetchCurrentReadingSessionProgress(this.props.bookUuid, this.state.currentReadingSession.uuid)
            .then(readingSessionProgress => this.successOnRetrieveReadingSessionProgress(readingSessionProgress.data))
            .catch(error => this.errorOnRetrieveReadingSessionProgress(error));
    }

    successOnRetrieveReadingSessionProgress(readingSessionProgress) {
        this.setState({
            readingSessionProgress
        });
    }

    errorOnRetrieveReadingSessionProgress() {
        this.setState({
            readingSessionProgress: null
        });
    }

    retrieveDateReadingSessions() {
        this.dateReadingSessions = new DateReadingSessions(this.props.bookUuid, this.state.currentReadingSession.uuid);
        this.dateReadingSessions.fetch()
            .then(dateReadingSessions => this.successOnDateReadingSessions())
            .catch(error => this.errorOnRetrieveDateReadingSessions(error));
    }

    successOnDateReadingSessions() {
        this.setState({
            dateReadingSessions: this.dateReadingSessions.map(dateReadingSession => dateReadingSession.attributes)
        });
    }

    errorOnRetrieveDateReadingSessions() {
        this.setState({
            message: localizer.localize('date-reading-sessions-retrieve-error', options.xhr.status)
        });
    }

    onInputChange(e) {
        const dateReadingSession = Object.assign({}, this.state.dateReadingSession);
        dateReadingSession[e.target.name] = e.target.value;
        this.setState({
            dateReadingSession
        });
    }

    onAddButtonClick() {
        const dateReadingSession = new DateReadingSession(this.state.dateReadingSession);
        dateReadingSession.isNewDateReadingSession = true;
        dateReadingSession.on("invalid", this.errorOnValidateDateReadingSession);
        this.dateReadingSessions.create(dateReadingSession, {
            success: this.successOnAddDateReadingSession,
            error: this.errorOnAddDateReadingSession
        });
    }

    errorOnValidateDateReadingSession(model, error) {
        this.setState({
            message: error
        });
    }

    successOnAddDateReadingSession() {
        const dateReadingSession = this.dateReadingSessions.get(this.state.dateReadingSession.date);
        delete dateReadingSession.isNewDateReadingSession;
        this.setState({
            message: null,
            dateReadingSession: {}
        });
        this.successOnDateReadingSessions();
    }

    errorOnAddDateReadingSession(model, response, options) {
        this.setState({
            message: localizer.localize('date-reading-session-add-error', options.xhr.status)
        });
    }

    onEditDateReadingSessionClick(dateReadingSession) {
        this.setState({
            message: null,
            operation: 'edit',
            dateReadingSession
        });
    }

    onUpdateButtonClick() {
        const dateReadingSession = this.dateReadingSessions.get(this.state.dateReadingSession.date);
        dateReadingSession.on("invalid", this.errorOnValidateDateReadingSession);
        dateReadingSession.save(this.state.dateReadingSession, {
            success: this.successOnUpdateDateReadingSession,
            error: this.errorOnUpdateDateReadingSession
        });
    }

    successOnUpdateDateReadingSession() {
        this.setState({
            message: null,
            operation: 'add',
            dateReadingSession: {}
        });
        this.successOnDateReadingSessions();
    }

    errorOnUpdateDateReadingSession(model, response, options) {
        this.setState({
            message: localizer.localize('date-reading-session-update-error', options.xhr.status)
        });
    }

    onDeleteDateReadingSessionClick(date) {
        const dateReadingSession = this.dateReadingSessions.get(date);
        dateReadingSession.destroy()
            .then(() => this.successOnDateReadingSessions())
            .catch(error => this.errorOnDeleteDateReadingSession(error));
    }

    errorOnDeleteDateReadingSession(error) {
        this.setState({
            message: localizer.localize('date-reading-session-delete-error', error.status)
        });
    }
}

CurrentReadingSessionComponent.propTypes = {
    bookUuid: PropTypes.string.isRequired
};

export default CurrentReadingSessionComponent;