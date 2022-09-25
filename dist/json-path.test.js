"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_1 = require("./mock");
const index_1 = require("./index");
it("should resolve an array of objects", () => {
    expect(mock_1.objectArrayMock[0].item.json_path_value).not.toBe("json_path_value_resolved");
    expect(mock_1.objectArrayMock[0].item.another_json_path_value).not.toBe("another_json_path_value_resolved");
    const paramsResolved = (0, index_1.resolveJsonPath)({
        dataSource: {
            json_path_value: "json_path_value_resolved",
            another_json_path_value: "another_json_path_value_resolved",
        },
        params: mock_1.objectArrayMock,
    });
    expect(paramsResolved[0].item.json_path_value).toBe("json_path_value_resolved");
    expect(paramsResolved[0].item.another_json_path_value).toBe("another_json_path_value_resolved");
});
it("should resolve an array of objects with a json path object result", () => {
    expect(mock_1.objectArrayMock[0].item.json_path_value).not.toBe("json_path_value_resolved");
    const paramsResolved = (0, index_1.resolveJsonPath)({
        dataSource: {
            json_path_value: {
                key: "json_path_value_resolved",
            },
            another_json_path_value: "another_json_path_value_resolved",
        },
        params: mock_1.objectArrayMock,
    });
    expect(paramsResolved[0].item.json_path_value.key).toBe("json_path_value_resolved");
});
it("should throw a error if the json path field is not found", () => {
    try {
        (0, index_1.resolveJsonPath)({
            dataSource: {
                json_path_value: { key: "json_path_value_resolved" },
                another_json_path_value: "another_json_path_value_resolved",
            },
            params: mock_1.invalidObjectArrayMock,
        });
    }
    catch (error) {
        expect(error.message).toBe("Json path field not found");
    }
});
it("should resolve formula: formulaAndTwoJsonPaths", () => {
    const { formula } = (0, index_1.resolveJsonPath)({
        dataSource: mock_1.formulaCommonDataSource,
        params: mock_1.formulaAndTwoJsonPaths,
    });
    expect(formula).toBe((0, index_1.buildExpression)([
        mock_1.sumExpression,
        "*",
        mock_1.formulaCommonDataSource.jsonPath1.balance,
        "+",
        mock_1.formulaCommonDataSource.jsonPath2.balance,
    ]));
});
it("should resolve formula: jsonPathFormulaJsonPath", () => {
    const { formula } = (0, index_1.resolveJsonPath)({
        dataSource: mock_1.formulaCommonDataSource,
        params: mock_1.jsonPathFormulaJsonPath,
    });
    expect(formula).toBe((0, index_1.buildExpression)([
        mock_1.formulaCommonDataSource.jsonPath1.balance,
        "*",
        mock_1.sumExpression,
        "+",
        mock_1.formulaCommonDataSource.jsonPath2.balance,
    ]));
});
it("should resolve formula: twoJsonPathsAndFormula", () => {
    const { formula } = (0, index_1.resolveJsonPath)({
        dataSource: mock_1.formulaCommonDataSource,
        params: mock_1.twoJsonPathsAndFormula,
    });
    expect(formula).toBe((0, index_1.buildExpression)([
        mock_1.formulaCommonDataSource.jsonPath1.balance,
        "*",
        mock_1.formulaCommonDataSource.jsonPath2.balance,
        "+",
        mock_1.sumExpression,
    ]));
});
it("should resolve formula: formulaWithStartingSpace", () => {
    const { formula } = (0, index_1.resolveJsonPath)({
        dataSource: mock_1.formulaCommonDataSource,
        params: mock_1.formulaWithStartingSpace,
    });
    expect(formula).toBe((0, index_1.buildExpression)([
        mock_1.sumExpression,
        "*",
        mock_1.formulaCommonDataSource.jsonPath1.balance,
        "+",
        mock_1.formulaCommonDataSource.jsonPath2.balance,
    ]));
});
//# sourceMappingURL=json-path.test.js.map