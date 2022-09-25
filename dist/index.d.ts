declare type ResolvePathComponentParams = {
    [x: string]: any;
} | string[] | any[];
declare type ResolveJsonPath = {
    bundle: Object;
    componentParams: ResolvePathComponentParams;
};
export declare const buildExpression: (strArr: (string | number)[]) => string;
export declare const resolveJsonPath: ({ bundle, componentParams, }: ResolveJsonPath) => Array<any> | any;
export {};
