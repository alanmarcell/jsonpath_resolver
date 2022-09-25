export const formulaCommonDataSource = {
  jsonPath1: { balance: 500 },
  jsonPath2: { balance: 1000 },
};

export const sumExpression = "SUM(2, 3)";
const jsonPath1 = "$.jsonPath1.balance";
const jsonPath2 = "$.jsonPath2.balance";

export const buildExpression = (strArr: (string | number)[]) =>
  strArr.join(" ");

export const formulaAndTwoJsonPaths = {
  formula: buildExpression([sumExpression, "*", jsonPath1, "+", jsonPath2]),
};

export const jsonPathFormulaJsonPath = {
  formula: buildExpression([jsonPath1, "*", sumExpression, "+", jsonPath2]),
};

export const twoJsonPathsAndFormula = {
  formula: buildExpression([jsonPath1, "*", jsonPath2, "+", sumExpression]),
};

export const formulaWithStartingSpace = {
  formula:
    " " + buildExpression([sumExpression, "*", jsonPath1, "+", jsonPath2]),
};

export const objectArrayMock = [
  {
    item: {
      json_path_value: "$.json_path_value",
      short_expression: "string",
      long_string: "this a long expression",
      another_json_path_value: "$.another_json_path_value",
    },
  },
];

export const invalidObjectArrayMock = [
  {
    item: {
      json_path_value: "$.invalid_json_path_value",
      short_expression: "string",
      long_string: "this a long expression",
    },
  },
];
