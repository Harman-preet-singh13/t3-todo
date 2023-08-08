import { useSession } from 'next-auth/react'
import React, { useRef, useState, FormEvent, useCallback, useLayoutEffect } from 'react'
import { api } from '~/utils/api'

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

export default function NewTodoForm() {

    const session = useSession()

    const [inputValue, setInputValue] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement>();
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea
    }, [])

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current)
    },[inputValue])

    if(session.status !== "authenticated") return null
    
    const trpcUtils = api.useContext()
    const createTodo = api.todo.create.useMutation({
        onSuccess: (NewTodo) => {
            setInputValue("");

            if (session.status === "authenticated") return null
            //for adding the new todo without refershing the page..
            
            trpcUtils.todo.infiniteFeed.setInfiniteData({}, (oldData) => {
                if(oldData == null || oldData.pages[0] == null) return

                const newCacheTodo = {
                    ...NewTodo,
                }

                return {
                    ...oldData,
                    pages:[
                        {
                            ...oldData.pages[0],
                            todos: [newCacheTodo, ...oldData.pages[0].todos],
                        },
                        ...oldData.pages.slice(1)
                    ]
                }
            })
            
        }
    })

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        createTodo.mutate({ content: inputValue})
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 px-4 py-2 shadow-md"
            >
                <div className="flex gap-2">
                    <textarea 
                    ref={inputRef}
                    style={{height: 0}}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
                    placeholder="Something..."
                    required
                    />
                </div>
                <button
                className=" self-center bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                >
                    Add Todo
                </button>
            </form>
        </>
    )
}
