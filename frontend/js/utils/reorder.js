// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default reorder;

export const reorderTasks = ({ tasksByColumn, source, destination }) => {
  const current = [...tasksByColumn[source.droppableId]];
  const next = [...tasksByColumn[destination.droppableId]];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(current, source.index, destination.index);
    const result = {
      ...tasksByColumn,
      [source.droppableId]: reordered,
    };
    return {
      tasksByColumn: result,
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result = {
    ...tasksByColumn,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    tasksByColumn: result,
  };
};
