import {FunctionComponent, useMemo} from 'react';
import sanitizeHtml from 'sanitize-html';
import {highlight, single} from 'fuzzysort';
import './Highlight.style.scss';

interface IHighlight {
    text: string;
    search: string;
}

export const Highlight: FunctionComponent<IHighlight> = (props) => {
    const sanitizeText: string = useMemo(
        () =>
            sanitizeHtml(props.text, {
                allowedTags: [],
                allowedAttributes: {},
            }),
        [props.text]
    );

    const highlightText: string | null = useMemo(
        // @ts-ignore
        () => highlight(single(props.search, sanitizeText), `<span class="ui-lib-highlight">`, '</span>'),
        [props.search, sanitizeText]
    );

    return <div className="ui-lib-highlight__container" dangerouslySetInnerHTML={{__html: highlightText || sanitizeText}} />;
};
