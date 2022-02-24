declare const _default: import("vue").DefineComponent<{
    uploadUrl: {
        type: StringConstructor;
        default: string;
    };
    uploadSuccess: {
        type: FunctionConstructor;
        default: () => (result: any) => string;
    };
    uploadFail: {
        type: FunctionConstructor;
        default: () => (error: any) => void;
    };
}, {
    url: import("vue").Ref<string>;
    desc: import("vue").Ref<string>;
    triggerClick(): void;
    upload(): void;
    handler(): void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    uploadUrl: {
        type: StringConstructor;
        default: string;
    };
    uploadSuccess: {
        type: FunctionConstructor;
        default: () => (result: any) => string;
    };
    uploadFail: {
        type: FunctionConstructor;
        default: () => (error: any) => void;
    };
}>>, {
    uploadUrl: string;
    uploadSuccess: Function;
    uploadFail: Function;
}>;
export default _default;
