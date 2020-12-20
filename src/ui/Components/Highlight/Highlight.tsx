import {FunctionComponent} from 'react';
import sanitizeHtml from 'sanitize-html';
import {highlight, single} from 'fuzzysort';
import './Highlight.style.scss';

interface IHighlight {
    text: string;
    search: string;
}

export const Highlight: FunctionComponent<IHighlight> = (props) => {
    const sanitizeText: string = sanitizeHtml(props.text, {
        allowedTags: [],
        allowedAttributes: {},
    });
    //@ts-ignore
    const highlightText = highlight(single(props.search, sanitizeText), '<span class="ui-lib-highlight">', '</span>');

    return <div className="ui-lib-highlight__container" dangerouslySetInnerHTML={{__html: highlightText || sanitizeText}} />;
};
