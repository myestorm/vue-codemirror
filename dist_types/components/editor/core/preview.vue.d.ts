import '../theme/preview.scss';
declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    root: {
        type: {
            new (): Element;
            prototype: Element;
        };
        default: null;
    };
}, {
    previewBox: import("vue").Ref<Element | undefined>;
    height: import("vue").Ref<number>;
    html: import("vue").ComputedRef<string>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    root: {
        type: {
            new (): Element;
            prototype: Element;
        };
        default: null;
    };
}>>, {
    modelValue: string;
    root: Element;
}>;
export default _default;
