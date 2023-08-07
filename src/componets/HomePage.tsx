import { api } from "~/utils/api";
import NavBar from "./NavBar";
import NewTodoForm from "./NewTodoForm";
import TodoList from "./TodoList";


export default function HomePage() {
  return (
    <>
      <NavBar />
      <NewTodoForm />
      <div className="mt-5">
        <ShowTodo />
      </div>
    </>
  )
}

function ShowTodo() {

  const todos = api.todo.infiniteFeed.useInfiniteQuery({},
    { getNextPageParam: (lastPage) => lastPage.nextCursor}
  )

   return (
    <TodoList
      todos={todos?.data?.pages.flatMap((page)=> page.todos) || []}
      isError={todos.isError}
      isLoading={todos.isLoading}
      hasMore={todos.hasNextPage}
      fetchNewTodos={todos.fetchNextPage}
    />
   )
}