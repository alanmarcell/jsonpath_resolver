"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidObjectArrayMock = exports.objectArrayMock = exports.formulaWithStartingSpace = exports.twoJsonPathsAndFormula = exports.jsonPathFormulaJsonPath = exports.formulaAndTwoJsonPaths = exports.buildExpression = exports.sumExpression = exports.formulaCommonBundle = void 0;
exports.formulaCommonBundle = {
    jsonPath1: { balance: 500 },
    jsonPath2: { balance: 1000 },
};
exports.sumExpression = "SUM(2, 3)";
const jsonPath1 = "$.jsonPath1.balance";
const jsonPath2 = "$.jsonPath2.balance";
const buildExpression = (strArr) => strArr.join(" ");
exports.buildExpression = buildExpression;
exports.formulaAndTwoJsonPaths = {
    formula: (0, exports.buildExpression)([exports.sumExpression, "*", jsonPath1, "+", jsonPath2]),
};
exports.jsonPathFormulaJsonPath = {
    formula: (0, exports.buildExpression)([jsonPath1, "*", exports.sumExpression, "+", jsonPath2]),
};
exports.twoJsonPathsAndFormula = {
    formula: (0, exports.buildExpression)([jsonPath1, "*", jsonPath2, "+", exports.sumExpression]),
};
exports.formulaWithStartingSpace = {
    formula: " " + (0, exports.buildExpression)([exports.sumExpression, "*", jsonPath1, "+", jsonPath2]),
};
exports.objectArrayMock = [
    {
        item: {
            json_path_value: "$.json_path_value",
            short_expression: "string",
            long_string: "this a long expression",
            another_json_path_value: "$.another_json_path_value",
        },
    },
];
exports.invalidObjectArrayMock = [
    {
        item: {
            json_path_value: "$.invalid_json_path_value",
            short_expression: "string",
            long_string: "this a long expression",
        },
    },
];
//# sourceMappingURL=mock.js.map