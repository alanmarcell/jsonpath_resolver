"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveJsonPath = exports.handleStringJsonPath = exports.buildExpression = void 0;
const jsonpath_1 = __importDefault(require("jsonpath"));
const ramda_1 = require("ramda");
const restrictedChars = ["*"];
const isFilledObjectOrArray = (p) => typeof p === "object" && Object.keys(p).length;
const filterNotNil = (0, ramda_1.filter)((0, ramda_1.complement)(ramda_1.isNil));
const buildExpression = (strArr) => strArr.join(" ");
exports.buildExpression = buildExpression;
const resolveJpValue = (bundle) => (possibleJsonPath) => {
    if (restrictedChars.includes(possibleJsonPath))
        return possibleJsonPath;
    try {
        return jsonpath_1.default.value(bundle, possibleJsonPath);
    }
    catch (e) {
        return possibleJsonPath;
    }
};
/**
 *
 * Eliminate whitespace between expressions, add '$' in current json path expression and eliminate empty strings
 *
 * @param acc
 * @param expressionItem
 * @param i
 * @returns Array with every word separated by a space
 */
const handleExpressionItem = (acc, expressionItem, i) => {
    if (i === 0)
        return [(0, ramda_1.trim)(expressionItem)];
    const expressionItemList = ("$" + expressionItem).split(" ");
    return [...acc, ...expressionItemList].filter((x) => x.length);
};
/**
 *
 * Receives a string and return a Array with every word and without the spaces
 *
 * @param param String input
 * @returns  Array with every word and without the spaces
 */
const buildExpressionItems = (param) => param.split("$").reduce(handleExpressionItem, []);
const tryParseStringJson = ({ dataSource, param }) => JSON.stringify((0, exports.resolveJsonPath)({
    dataSource,
    params: JSON.parse(param),
}));
const handleStringJsonPath = ({ dataSource, param }) => {
    try {
        return tryParseStringJson({ dataSource, param });
    }
    catch {
        const expressionItems = buildExpressionItems(param);
        if (expressionItems.length === 1) {
            const result = jsonpath_1.default.value(dataSource, param);
            if (result === undefined)
                throw new Error("Json path field not found");
            if (typeof result === "object")
                return result;
        }
        const resolvedExpressionItems = expressionItems.map(resolveJpValue(dataSource));
        return resolvedExpressionItems.join(" ");
    }
};
exports.handleStringJsonPath = handleStringJsonPath;
const handleJsonPathItem = (0, ramda_1.curry)((dataSource, param) => {
    if (typeof param === "string" && param.length && param.includes("$")) {
        return (0, exports.handleStringJsonPath)({ dataSource, param });
    }
    if (isFilledObjectOrArray(param)) {
        return (0, exports.resolveJsonPath)({
            params: param,
            dataSource,
        });
    }
    return param;
});
/**
 * Resolves an Array or Object containing jsonpaths, obtaining this values from a given data source
 *
 * @param dataSource - Source of data that will replace jsonpaths
 * @param params - Object or Array containing jsonpaths to be resolved
 * @returns Params Object ou Array keys with jsonpaths values resolved
 */
const resolveJsonPath = ({ dataSource, params, }) => (0, ramda_1.map)(handleJsonPathItem(dataSource), filterNotNil(params));
exports.resolveJsonPath = resolveJsonPath;
//# sourceMappingURL=index.js.map