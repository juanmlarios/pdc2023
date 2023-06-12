type IFunction<T> = (arg: T) => boolean;

export const recordToArray = <T>(record: Record<string, T>, func?: IFunction<T>) => {
  const addedArray: Array<T> = [];
  Object.keys(record).map((key) => {
    if (func === undefined || (func && func(record[key]))) addedArray.push(record[key]);
  });
  return addedArray;
};

