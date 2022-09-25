declare type JsonpathParam = {
    dataSource: Object;
    param: string;
};
export declare const buildExpression: (strArr: (string | number)[]) => string;
export declare const handleStringJsonPath: ({ dataSource, param }: JsonpathParam) => any;
/**
 * Resolves an Array or Object containing jsonpaths, obtaining this values from a given data source
 *
 * @param dataSource - Source of data that will replace jsonpaths
 * @param params - Object or Array containing jsonpaths to be resolved
 * @returns Params Object ou Array keys with jsonpaths values resolved
 */
export declare const resolveJsonPath: ({ dataSource, params, }: {
    dataSource: Object;
    params: any[] | string[] | {
        [x: string]: any;
    };
}) => Array<any> | any;
export {};
