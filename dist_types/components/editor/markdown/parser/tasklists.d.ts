import MarkdownIt from 'markdown-it';
interface Options {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
    lineNumber?: boolean;
}
declare function MarkdownItTaskLists(md: MarkdownIt, options: Options): void;
export default MarkdownItTaskLists;
