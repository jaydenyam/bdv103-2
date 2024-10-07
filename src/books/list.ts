import { z } from "zod";
import { book_collection } from "../db";
import { Book } from "../../adapter/assignment-2";
import { ZodRouter } from "koa-zod-router";

export default function books_list(router: ZodRouter) {
    router.register({
        name: "list books",
        method: "get",
        path: "/books",
        validate: {
            query: z.object({
                filters: z.object({
                    from: z.coerce.number().optional(),
                    to: z.coerce.number().optional()
                }).array().optional()
            })
        },
        handler: async (ctx, next) => {
            console.log("books_list called on backend");
            const { filters } = ctx.request.query;

            const query = filters?.length ? {
                $or: filters.flatMap(({ from, to }) => {
                    const filter: { price: { $gte?: number, $lte?: number } } = { price: {} };
                    if (from !== undefined) filter.price.$gte = from;
                    if (to !== undefined) filter.price.$lte = to;
                    return Object.keys(filter.price).length ? [filter] : [];
                })
            } : {};

            const book_list = await book_collection.find(query).map(document => ({
                id: document._id.toHexString(),
                name: document.name,
                image: document.image,
                price: document.price,
                author: document.author,
                description: document.description
            })).toArray();

            ctx.body = book_list;
            await next();
        }
    });
}