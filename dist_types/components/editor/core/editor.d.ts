import { Line } from '@codemirror/text';
import { EditorView, ViewUpdate, KeyBinding } from '@codemirror/view';
import { EditorState, Extension, Compartment } from '@codemirror/state';
import prettier from 'prettier/standalone';
import { EditorConfigType } from '../extensions/index';
declare class BaseEditor {
    box: Element;
    state: EditorState;
    view: EditorView;
    theme: Compartment;
    isDark: boolean;
    themeDark: Extension;
    themeLight: Extension;
    extensions: Extension[];
    events: {
        focus: (update: ViewUpdate, value: string) => void;
        blur: (update: ViewUpdate, value: string) => void;
        change: (update: ViewUpdate, value: string) => void;
        selectionChange: (update: ViewUpdate, line: Line) => void;
    };
    hotKeyMaps: KeyBinding[];
    prettier: typeof prettier;
    constructor(options?: EditorConfigType);
    $$(exp: string): Element | null;
    focusChanged(update: ViewUpdate, value: string): void;
    selectionSet(update: ViewUpdate): void;
    getValue(): string;
    setValue(val?: string): void;
    /**
     * 设置光标位置，以当前光标为基准，设置便宜量
     * @param offsetFrom number 开始点偏移量
     * @param offsetTo number 结束点偏移量
     */
    setCursor(offsetFrom: number, offsetTo: number): void;
    regExpcharacterEscape(str: string): string;
}
export default BaseEditor;
