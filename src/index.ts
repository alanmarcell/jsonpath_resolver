import jp from "jsonpath";
import { map, filter, complement, isNil, trim, curry } from "ramda";

type JsonpathParam = {
  dataSource: Object;
  param: string;
};

const restrictedChars = ["*"];

const isFilledObjectOrArray = (p: any) =>
  typeof p === "object" && Object.keys(p).length;

const filterNotNil = filter(complement(isNil));

export const buildExpression = (strArr: (string | number)[]) =>
  strArr.join(" ");

const resolveJpValue = (bundle: any) => (possibleJsonPath: string) => {
  if (restrictedChars.includes(possibleJsonPath)) return possibleJsonPath;
  try {
    return jp.value(bundle, possibleJsonPath);
  } catch (e) {
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
const handleExpressionItem = (
  acc: any,
  expressionItem: string,
  i: number
): string[] => {
  if (i === 0) return [trim(expressionItem)];

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
const buildExpressionItems = (param: string) =>
  param.split("$").reduce(handleExpressionItem, []);

const tryParseStringJson = ({ dataSource, param }: JsonpathParam): string =>
  JSON.stringify(
    resolveJsonPath({
      dataSource,
      params: JSON.parse(param),
    })
  );

export const handleStringJsonPath = ({ dataSource, param }: JsonpathParam) => {
  try {
    return tryParseStringJson({ dataSource, param });
  } catch {
    const expressionItems = buildExpressionItems(param);

    if (expressionItems.length === 1) {
      const result = jp.value(dataSource, param);

      if (result === undefined) throw new Error("Json path field not found");

      if (typeof result === "object") return result;
    }

    const resolvedExpressionItems = expressionItems.map(
      resolveJpValue(dataSource)
    );

    return resolvedExpressionItems.join(" ");
  }
};

const handleJsonPathItem = curry(
  (dataSource: Object, param: string | object | any[]): any => {
    if (typeof param === "string" && param.length && param.includes("$")) {
      return handleStringJsonPath({ dataSource, param });
    }

    if (isFilledObjectOrArray(param)) {
      return resolveJsonPath({
        params: param as Object,
        dataSource,
      });
    }

    return param;
  }
);

/**
 * Resolves an Array or Object containing jsonpaths, obtaining this values from a given data source
 *
 * @param dataSource - Source of data that will replace jsonpaths
 * @param params - Object or Array containing jsonpaths to be resolved
 * @returns Params Object ou Array keys with jsonpaths values resolved
 */
export const resolveJsonPath = ({
  dataSource,
  params,
}: {
  dataSource: Object;
  params: { [x: string]: any } | string[] | any[];
}): Array<any> | any =>
  map(handleJsonPathItem(dataSource), filterNotNil(params as any));
