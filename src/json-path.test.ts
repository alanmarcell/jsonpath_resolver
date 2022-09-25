import {
  sumExpression,
  objectArrayMock,
  invalidObjectArrayMock,
  formulaAndTwoJsonPaths,
  formulaWithStartingSpace,
  formulaCommonDataSource,
  jsonPathFormulaJsonPath,
  twoJsonPathsAndFormula,
} from "./mock";
import { resolveJsonPath, buildExpression } from "./index";

it("should resolve an array of objects", () => {
  expect(objectArrayMock[0].item.json_path_value).not.toBe(
    "json_path_value_resolved"
  );

  expect(objectArrayMock[0].item.another_json_path_value).not.toBe(
    "another_json_path_value_resolved"
  );

  const paramsResolved = resolveJsonPath({
    dataSource: {
      json_path_value: "json_path_value_resolved",
      another_json_path_value: "another_json_path_value_resolved",
    },
    params: objectArrayMock,
  });

  expect(paramsResolved[0].item.json_path_value).toBe(
    "json_path_value_resolved"
  );

  expect(paramsResolved[0].item.another_json_path_value).toBe(
    "another_json_path_value_resolved"
  );
});

it("should resolve an array of objects with a json path object result", () => {
  expect(objectArrayMock[0].item.json_path_value).not.toBe(
    "json_path_value_resolved"
  );

  const paramsResolved = resolveJsonPath({
    dataSource: {
      json_path_value: {
        key: "json_path_value_resolved",
      },
      another_json_path_value: "another_json_path_value_resolved",
    },
    params: objectArrayMock,
  });

  expect(paramsResolved[0].item.json_path_value.key).toBe(
    "json_path_value_resolved"
  );
});

it("should throw a error if the json path field is not found", () => {
  try {
    resolveJsonPath({
      dataSource: {
        json_path_value: { key: "json_path_value_resolved" },
        another_json_path_value: "another_json_path_value_resolved",
      },
      params: invalidObjectArrayMock,
    });
  } catch (error: any) {
    expect(error.message).toBe("Json path field not found");
  }
});

it("should resolve formula: formulaAndTwoJsonPaths", () => {
  const { formula } = resolveJsonPath({
    dataSource: formulaCommonDataSource,
    params: formulaAndTwoJsonPaths,
  });

  expect(formula).toBe(
    buildExpression([
      sumExpression,
      "*",
      formulaCommonDataSource.jsonPath1.balance,
      "+",
      formulaCommonDataSource.jsonPath2.balance,
    ])
  );
});

it("should resolve formula: jsonPathFormulaJsonPath", () => {
  const { formula } = resolveJsonPath({
    dataSource: formulaCommonDataSource,
    params: jsonPathFormulaJsonPath,
  });

  expect(formula).toBe(
    buildExpression([
      formulaCommonDataSource.jsonPath1.balance,
      "*",
      sumExpression,
      "+",
      formulaCommonDataSource.jsonPath2.balance,
    ])
  );
});

it("should resolve formula: twoJsonPathsAndFormula", () => {
  const { formula } = resolveJsonPath({
    dataSource: formulaCommonDataSource,
    params: twoJsonPathsAndFormula,
  });

  expect(formula).toBe(
    buildExpression([
      formulaCommonDataSource.jsonPath1.balance,
      "*",
      formulaCommonDataSource.jsonPath2.balance,
      "+",
      sumExpression,
    ])
  );
});

it("should resolve formula: formulaWithStartingSpace", () => {
  const { formula } = resolveJsonPath({
    dataSource: formulaCommonDataSource,
    params: formulaWithStartingSpace,
  });

  expect(formula).toBe(
    buildExpression([
      sumExpression,
      "*",
      formulaCommonDataSource.jsonPath1.balance,
      "+",
      formulaCommonDataSource.jsonPath2.balance,
    ])
  );
});
