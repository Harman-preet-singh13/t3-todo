import { api } from "~/utils/api";
import NavBar from "./NavBar";
import NewTodoForm from "./NewTodoForm";
import TodoList from "./TodoList";
import Head from "next/head";
import { useSession } from "next-auth/react";


export default function HomePage() {
  
  const session = useSession()
  
  return (
    <>
    <Head>
      <title>T3-Todo {session.data?.user.name}</title>
    </Head>
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
      todos={todos.data?.pages.flatMap((page)=> page.todos) || []}
      isError={todos.isError}
      isLoading={todos.isLoading}
      hasMore={todos.hasNextPage}
      fetchNewTodos={todos.fetchNextPage}
    />
   )
}