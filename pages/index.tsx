import { GlobalStyles } from "@ui/theme/globaStyles";
import { todoController } from "@ui/controller/todo";
import { useEffect, useState } from "react";

const bg = "/background.jpg"; // Inside public folder

interface HomeTodo {
  id: string;
  content: string;
}

export default function Page() {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<HomeTodo[]>([]);
  const hasMorePages = totalPages > page;
  const hasNoTodos = todos.length === 0 && !isLoading;

  // Load infos onload
  useEffect(() => {
    setInitialLoadComplete(true);
    if (!initialLoadComplete) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [page]);
  return (
    <main>
      <GlobalStyles themeName="indigo" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form>
          <input type="text" placeholder="Correr, Estudar..." />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input type="text" placeholder="Filtrar lista atual, ex: Dentista" />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {todos.map((currentTodo) => {
              return (
                <tr key={currentTodo.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{currentTodo.id.substring(0, 4)}</td>
                  <td>{currentTodo.content}</td>
                  <td align="right">
                    <button data-type="delete">Apagar</button>
                  </td>
                </tr>
              );
            })}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);
                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                          setTotalPages(pages);
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    Página {page}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
