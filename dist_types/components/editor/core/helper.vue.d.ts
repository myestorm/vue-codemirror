declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    helper: {
        type: ObjectConstructor;
        default: () => {
            theme: boolean;
        };
    };
}, {
    list: {
        'Ctrl-s': string;
        'Ctrl-b': string;
        'Ctrl-1': string;
        'Ctrl-2': string;
        'Ctrl-3': string;
        'Ctrl-4': string;
        'Ctrl-5': string;
        'Ctrl-6': string;
        'Ctrl-Alt-t': string;
        'Ctrl-Alt-m': string;
        'Ctrl-Alt-p': string;
        'Ctrl-Alt-b': string;
        'Ctrl-Alt-i': string;
        'Ctrl-Alt-l': string;
        'Ctrl-Alt-h': string;
        'Ctrl-Alt-q': string;
        'Shift-Alt-o': string;
        'Shift-Alt-u': string;
        'Shift-Alt-t': string;
        'Shift-Alt-i': string;
        'Shift-Alt-b': string;
        'Shift-Alt-l': string;
    };
    changeTheme(theme: string): void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    helper: {
        type: ObjectConstructor;
        default: () => {
            theme: boolean;
        };
    };
}>>, {
    modelValue: string;
    helper: Record<string, any>;
}>;
export default _default;
