import { EditorView } from '@codemirror/view';
import { HotKeyTypes } from './index';
export interface MDHotKeyValueType<T> {
    type: HotKeyTypes;
    value: T;
    view: EditorView;
}
declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    config: {
        type: ObjectConstructor;
        default: () => {};
    };
    helper: {
        type: ObjectConstructor;
        default: () => {
            theme: boolean;
        };
    };
}, {
    id: string;
    rootBox: import("vue").Ref<any>;
    uploadVisible: import("vue").Ref<boolean>;
    uploadDone: (url: string, desc: string) => void;
    tableVisible: import("vue").Ref<boolean>;
    tableDone: (cols: number, rows: number) => void;
    previewVisible: import("vue").Ref<boolean>;
    previewDone: (cols: number, rows: number) => void;
    isFullscreen: import("vue").Ref<boolean>;
    theme: any;
    themeChange(theme: string): void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "blur" | "change" | "focus" | "ready" | "selectionChange" | "hotKey")[], "update:modelValue" | "blur" | "change" | "focus" | "ready" | "selectionChange" | "hotKey", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    config: {
        type: ObjectConstructor;
        default: () => {};
    };
    helper: {
        type: ObjectConstructor;
        default: () => {
            theme: boolean;
        };
    };
}>> & {
    onFocus?: ((...args: any[]) => any) | undefined;
    onBlur?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onReady?: ((...args: any[]) => any) | undefined;
    onSelectionChange?: ((...args: any[]) => any) | undefined;
    onHotKey?: ((...args: any[]) => any) | undefined;
}, {
    modelValue: string;
    helper: Record<string, any>;
    config: Record<string, any>;
}>;
export default _default;
