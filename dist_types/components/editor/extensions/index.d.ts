import { Extension } from '@codemirror/state';
export interface EditorConfigType {
    lineWrapping?: Boolean;
    lineNumbers?: Boolean;
    allowMultipleSelections?: Boolean;
    theme?: string;
}
export default function (options: EditorConfigType): Extension[];
