enum IdeaCommands {
  Create = 'create'
}
enum IdeaQueries {
  GetOne = 'get-one',
  GetAll = 'get-all'
}
enum IdeaEvents {}

export const Commands = {
  Ideas: IdeaCommands
};
export const Queries = {
  Ideas: IdeaQueries
};
export const Events = {
  Ideas: IdeaEvents
};
