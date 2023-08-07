import { inferAsyncReturnType } from "@trpc/server";
import { Prisma } from "@prisma/client";
import {  z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
    createTRPCContext,

} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({

    infiniteFeed: protectedProcedure
        .input(
            z.object({
                limit: z.number().optional(),
                cursor: z.object({ id: z.string(), createdAt: z.date(),complete: z.boolean() }).optional()
            })
        )
        .query(
            async ({ input: { limit = 10, cursor }, ctx }) => {

                return await getInfiniteTweets({
                    limit,
                    ctx,
                    cursor,
                })
            }
        ),

    create: protectedProcedure
        .input(z.object({ content: z.string() }))
        .mutation(async ({ input: { content }, ctx }) => {
            const todo = await ctx.prisma.todo.create({
                data: { content, userId: ctx.session.user.id }
            })

            return todo;
        }),

    deleteTodo: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input: { id }, ctx }) => {
      
            const todo = await ctx.prisma.todo.delete({
                where:{ id }
            })

            return todo;
        }),

        toggleTodo: protectedProcedure
        .input(z.object({ 
            id: z.string(),
            complete: z.boolean().optional()
         }))
        .mutation(async ({ input: { id, complete }, ctx }) => {
      
            const todo = await ctx.prisma.todo.update({
                where:{ id },
                data: {complete}
            })

            return todo;
        }),
});


async function getInfiniteTweets({
    ctx,
    limit,
    cursor,
}: {
    limit: number;
    ctx: inferAsyncReturnType<typeof createTRPCContext>;
    cursor: { id: string; createdAt: Date } | undefined;
}) {


    const data = await ctx.prisma.todo.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }, ],
        
    })

    let nextCursor: typeof cursor | undefined
    if (data.length > limit) {
        const nextItem = data.pop()
        if (nextItem != null) {
            nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt }
        }
    }

    return {
        todos: data.map((todo) => {
            return {
                id: todo.id,
                content: todo.content,
                createdAt: todo.createdAt,
                complete: todo.complete
            }
        }), nextCursor
    }
}