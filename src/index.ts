import jp from "jsonpath";
import { map, filter, complement, isNil, trim, curry } from "ramda";

const restrictedChars = ["*"];

const isFilledObjectOrArray = (p: any) =>
  typeof p === "object" && Object.keys(p).length;

const filterNotNil = filter(complement(isNil));

type ResolvePathComponentParams = { [x: string]: any } | string[] | any[];

type ResolveJsonPath = {
  dataSource: Object;
  params: ResolvePathComponentParams;
};

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

// Eliminate whitespace between expressions, add '$' in current json path expression and eliminate empty strings
const handleExpressionItem = (
  acc: any,
  expressionItem: string,
  i: number
): never[] => {
  if (i === 0) return [trim(expressionItem)] as never[];

  const expressionItemList = ("$" + expressionItem).split(" ");
  return [...acc, ...expressionItemList].filter((x) => x.length) as never;
};

export const handleStringJsonPath = ({
  dataSource,
  param,
}: {
  dataSource: any;
  param: string;
}): any => {
  try {
    return JSON.stringify(
      resolveJsonPath({
        dataSource,
        params: JSON.parse(param),
      })
    );
  } catch {
    const expressionItems = param.split("$").reduce(handleExpressionItem, []);

    if (expressionItems.length === 1) {
      const result = jp.value(dataSource, param);

      if (result === undefined) throw new Error("Json path field not found");

      if (typeof result === "object") return result;
    }

    const resolvedExpressionItems = expressionItems.map((a: string) =>
      resolveJpValue(dataSource)(a)
    );

    return resolvedExpressionItems.join(" ");
  }
};

const handleJsonPathItem = curry(
  (dataSource: any, param: string | object | any[]): any => {
    if (typeof param === "string" && param.length && param.includes("$")) {
      return handleStringJsonPath({ dataSource, param });
    }

    if (isFilledObjectOrArray(param)) {
      return resolveJsonPath({
        params: param as ResolveJsonPath,
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
}: ResolveJsonPath): Array<any> | any =>
  map(
    handleJsonPathItem(dataSource),
    filterNotNil(params as any) as ResolvePathComponentParams
  );
