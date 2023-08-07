import InfiniteScroll from "react-infinite-scroll-component"
import LoadingSpinner from "./LoadingSpinner"
import { BsFillTrash3Fill } from "react-icons/bs"
import IconHoverEffect from "./IconHoverEffect"
import { api } from "~/utils/api"


type Todo = {
    id: string;
    content: string;
    createdAt: Date;
    complete: boolean | null;
}

type TodoListProps = {
    todos?: Todo[];
    isLoading: boolean;
    isError: boolean;
    hasMore: any;
    fetchNewTodos: () => Promise<unknown>;
}

const dataTimeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', year: '2-digit', month: '2-digit', day: '2-digit' })

export default function TodoList(
    {
        todos,
        isLoading,
        isError,
        hasMore,
        fetchNewTodos
    }: TodoListProps) {

    if (isLoading) return <LoadingSpinner />
    if (isError) return <h1>Error..</h1>

    if (todos == null || todos.length == 0) {
        return (
            <h2 className="text-2xl my-4 text-center">
                No Todos
            </h2>
        )
    }

    return (
        <ul>
            <InfiniteScroll
                dataLength={todos.length}
                next={fetchNewTodos}
                hasMore={hasMore}
                loader={<LoadingSpinner />}
            >
                {todos.map((todo) => {
                    return <TodoCard key={todo.id} {...todo} />
                })}
            </InfiniteScroll>
        </ul>
    )
}

function TodoCard({
    id,
    content,
    createdAt,
    complete
}: Todo) {


    const trpcUtils = api.useContext()

    const deleteTodo = api.todo.deleteTodo.useMutation({
        onSuccess: (DeletedTodo) => {

            trpcUtils.todo.infiniteFeed.setInfiniteData({}, (oldData) => {
                if (oldData == null || oldData.pages[0] == null) return

                    const DeletingTodosFromArray = oldData.pages[0].todos.filter((todo) => todo.id !== DeletedTodo.id);

                    return {
                        ...oldData,
                        pages: [
                            {
                                ...oldData.pages[0],
                                todos: DeletingTodosFromArray,
                            },
                            ...oldData.pages.slice(1)
                        ]
                    }
                
            })
        }
    })

    function handleDeleteTodo() {
        deleteTodo.mutate({ id })
    }




    return (
        <div className="rounded overflow-hidden border-2 shadow-md">
            <div className="px-6 py-4">
                <div className="text-xs text-slate-500">
                    {dataTimeFormatter.format(createdAt)}
                </div>
                <div className="flex">
                    <div className="grow font-semibold text-xl mb-2">
                        <ToggleTodo id={id} content={content} complete={complete} />

                    </div>
                    <div>
                        <DeleteButton
                            onClick={handleDeleteTodo}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

type ToogleTodoProps = {
    complete: boolean | null
    id: string
    content: string
}

function ToggleTodo({ complete, id, content }: ToogleTodoProps) {

    const handleToggle = api.todo.toggleTodo.useMutation()


    function handleToggleTodo() {
        handleToggle.mutate({ id })
    }

    return (
        <div className="flex gap-2">
            <input
                id={id}
                type="checkbox"
                className="cursor-pointer peer"
                defaultChecked={complete !== null ? complete : false}
                onChange={handleToggleTodo}
            />
            <label
                htmlFor={id}
                className="cursor-pointer peer-checked:line-through peer-checked:text-slate-400 peer-checked:font-normal"
            >
                {content}
            </label>
        </div>
    )
}


type DeleteButtonProps = {
    onClick: () => void
}

function DeleteButton({ onClick }: DeleteButtonProps) {

    return (
        <button
            className="text-red-500"
            onClick={onClick}
        >
            <IconHoverEffect>
                <BsFillTrash3Fill />
            </IconHoverEffect>
        </button>
    )
}
