"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveJsonPath = exports.buildExpression = void 0;
const jsonpath_1 = __importDefault(require("jsonpath"));
const ramda_1 = require("ramda");
const isFilledObjectOrArray = (p) => typeof p === "object" && Object.keys(p).length;
const buildExpression = (strArr) => strArr.join(" ");
exports.buildExpression = buildExpression;
const restrictedChars = ["*"];
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
// Elimina espaçoes em branco entre as expressôes, adiciona o '$' na expressão json path atual e elimina as strings vazias
const handleExpressionItem = (acc, expressionItem, i) => {
    if (i === 0)
        return [(0, ramda_1.trim)(expressionItem)];
    const expressionItemList = ("$" + expressionItem).split(" ");
    return [...acc, ...expressionItemList].filter((x) => x.length);
};
const handleStringJsonPath = ({ bundle, componentParam, }) => {
    try {
        return JSON.stringify((0, exports.resolveJsonPath)({
            bundle,
            componentParams: JSON.parse(componentParam),
        }));
    }
    catch {
        const expressionItems = componentParam
            .split("$")
            .reduce(handleExpressionItem, []);
        if (expressionItems.length === 1) {
            const result = jsonpath_1.default.value(bundle, componentParam);
            if (result === undefined)
                throw new Error("Json path field not found");
            if (typeof result === "object")
                return result;
        }
        const resolvedExpressionItems = expressionItems.map((a) => resolveJpValue(bundle)(a));
        return resolvedExpressionItems.join(" ");
    }
};
const handleJsonPathItem = (0, ramda_1.curry)((bundle, componentParam) => {
    if (typeof componentParam === "string" &&
        componentParam.length &&
        componentParam.includes("$")) {
        return handleStringJsonPath({ bundle, componentParam });
    }
    if (isFilledObjectOrArray(componentParam)) {
        return (0, exports.resolveJsonPath)({
            componentParams: componentParam,
            bundle,
        });
    }
    return componentParam;
});
const resolveJsonPath = ({ bundle, componentParams, }) => (0, ramda_1.map)(handleJsonPathItem(bundle), (0, ramda_1.filter)((0, ramda_1.complement)(ramda_1.isNil), componentParams));
exports.resolveJsonPath = resolveJsonPath;
//# sourceMappingURL=index.js.map