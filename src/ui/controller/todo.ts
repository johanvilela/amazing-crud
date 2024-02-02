import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
  page: number;
}
async function get(params: TodoControllerGetParams) {
  // Fazer a lógica para pegar os dados
  return todoRepository.get({
    page: params.page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Array<Todo> {
  const homeTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });
  return homeTodos;
}

interface TodoControllerCreateParams {
  content?: string;
  onError: () => void;
  onSuccess: (todo: any) => void;
}

function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  // Fail Fast
  if (!content) {
    onError();
    return;
  }

  const todo = {
    id: "123456",
    content,
    date: new Date(),
    done: false,
  };
  onSuccess(todo);
  console.log("Criada com sucesso!");
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
};
