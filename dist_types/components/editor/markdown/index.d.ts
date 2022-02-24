import BaseEditor from '../core/editor';
import { EditorView } from '@codemirror/view';
import { EditorConfigType } from '../extensions/index';
export interface MarkdownEditorOptionsType {
    initValue?: string;
    config?: EditorConfigType;
}
export declare enum HotKeyTypes {
    ctrlS = "Ctrl-s",
    ctrlB = "Ctrl-b",
    ctrl1 = "Ctrl-1",
    ctrl2 = "Ctrl-2",
    ctrl3 = "Ctrl-3",
    ctrl4 = "Ctrl-4",
    ctrl5 = "Ctrl-5",
    ctrl6 = "Ctrl-6",
    ctrlAltT = "Ctrl-Alt-t",
    ctrlAltM = "Ctrl-Alt-m",
    ctrlAltP = "Ctrl-Alt-p",
    ctrlAltB = "Ctrl-Alt-b",
    ctrlAltI = "Ctrl-Alt-i",
    ctrlAltL = "Ctrl-Alt-l",
    ctrlAltH = "Ctrl-Alt-h",
    ctrlAltQ = "Ctrl-Alt-q",
    shiftAltO = "Shift-Alt-o",
    shiftAltU = "Shift-Alt-u",
    shiftAltT = "Shift-Alt-t",
    shiftAltI = "Shift-Alt-i",
    shiftAltB = "Shift-Alt-b",
    shiftAltL = "Shift-Alt-l",
    F11 = "F11"
}
declare class MarkdownEditor extends BaseEditor {
    options: MarkdownEditorOptionsType;
    hotKey: <T>(type: HotKeyTypes, value: T, view: EditorView) => void;
    constructor(id: string, options?: MarkdownEditorOptionsType);
    /**
     * 在行首插入字符
     * @param insertion string
     */
    insertLineStart(insertion: string): void;
    /**
     * 删除行首的字符
     * @param insertion string
     */
    removeLineStart(insertion: string): void;
    /**
     * 两种状态切换，有则删除，没有则添加
     * @param insertion string
     */
    toggleInsertLineStart(insertion: string): void;
    /**
     * 选区两端插入标签
     * @param startInsertion string
     * @param endInsertion string
     */
    insertAroundSelection(startInsertion: string, endInsertion: string): void;
    /**
     * 选区两端删除标签
     * @param startInsertion string
     * @param endInsertion string
     */
    removeAroundSelection(startInsertion: string, endInsertion: string): void;
    /**
     * 两种状态切换，有则删除，没有则添加
     * @param startInsertion string
     * @param endInsertion string
     */
    toggleAroundSelection(startInsertion: string, endInsertion: string): void;
    /**
     * 在首尾插入两行，典型应用代码块
     * @param beforeInsertion string
     * @param afterInsertion string
     */
    insertAroundLine(beforeInsertion: string, afterInsertion: string): void;
    /**
     * 在光标后插入一行
     * @param insertion string
     */
    insertLineAfterCursor(insertion: string): void;
    /**
     * 选中的每行前插入
     * @param insertion string
     */
    insertStartPerLine(insertion: string): void;
    /**
     * 插入媒体文件
     * @param url string 媒体地址
     * @param desc string 描述
     */
    insertMedia(url: string, desc?: string): void;
    /**
     * 插入表格
     * @param cols number 列
     * @param rows number 行
     */
    insertTable(cols: number, rows: number): void;
    /**
     * 插入链接
     * @param url string 链接地址
     * @param title string 链接描述
     */
    insertLink(url?: string, title?: string): void;
}
export default MarkdownEditor;
