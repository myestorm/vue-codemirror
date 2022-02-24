/**
 * https://github.com/eloquence/markdown-it-html5-media/blob/master/lib/index.js
 * A minimalist `markdown-it` plugin for parsing video/audio references inside
 * markdown image syntax as `<video>` / `<audio>` tags.
 *
 * @namespace HTML5Media
 */
import MarkdownIt from 'markdown-it';
/**
 * Guess the media type represented by a URL based on the file extension,
 * if any
 *
 * @param {String} url
 *  any valid URL
 * @returns {String}
 *  a type identifier: 'image' (default for all unrecognized URLs), 'audio'
 *  or 'video'
 * @memberof HTML5Media
 */
export declare function guessMediaType(url: string): string;
/**
 * The main plugin function, exported as module.exports
 *
 * @param {MarkdownIt} md
 *  instance, automatically passed by md.use
 * @param {Object} [options]
 *  configuration
 * @param {String} [options.videoAttrs='controls class="html5-video-player"']
 *  attributes to include inside `<video>` tags
 * @param {String} [options.audioAttrs='controls class="html5-audio-player"']
 *  attributes to include inside `<audio>` tags
 * @param {MessagesObj} [options.messages=built-in messages]
 *  human-readable text that is part of the output
 * @memberof HTML5Media
 */
export declare function html5Media(md: MarkdownIt, options?: {}): void;
declare const _default: {
    html5Media: typeof html5Media;
    guessMediaType: typeof guessMediaType;
};
export default _default;
