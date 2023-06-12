
export interface IProcessable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  process(message: any): Promise<any>;
}