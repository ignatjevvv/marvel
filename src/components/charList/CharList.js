import { Component } from 'react';
import MarvelService from '../../services/MarverlService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount = () => {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    createComponent = (charList) => {
        return charList.map(item => {
            const { id, name, thumbnail } = item;
            const styleImg = thumbnail.indexOf('image_not_available') !== -1 ? { objectFit: 'unset' } : null;

            return (
                <li className="char__item"
                    key={id}
                    onClick={() => this.props.onCharSelected(id)}>
                    <img src={thumbnail} style={styleImg} alt={name} />
                    <div className="char__name">{name}</div>
                </li>
            )
        })
    }

    render() {
        const { charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage /> : null;
        const component = !(loading || error) ? this.createComponent(charList) : null;

        const styleCharGrid = (loading || error) ? { display: 'block' } : null;

        return (
            <div className="char__list">
                <ul style={styleCharGrid} className="char__grid">
                    {errorMessage}
                    {spinner}
                    {component}
                </ul>
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;