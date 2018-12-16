const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

const formatBlog = blog => {
    return {
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    };
};

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs.map(formatBlog));
});

blogsRouter.post("/", async (request, response) => {
    try {
        const body = request.body;

        if (body.title === undefined) {
            //console.log("title missing");
            return response.status(400).json({
                error: "title missing"
            });
        }
        if (body.author === undefined) {
            //console.log("author missing");
            return response.status(400).json({
                error: "author missing"
            });
        }
        if (body.url === undefined) {
            //console.log("url missing");
            return response.status(400).json({
                error: "url missing"
            });
        }
        let likes = 0;
        if (body.likes !== undefined) {
            //console.log("set likes to:", body.likes);
            likes = body.likes;
        }
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: likes
        });

        const savedBlog = await blog.save();
        response.json(formatBlog(savedBlog));
    } catch (exception) {
        console.log("save blog", exception);
        response
            .status(500)
            .json({
                error: "save blog something went wrong..."
            });
    }
});

blogsRouter.delete("/:id", async (request, response) => {
    try {
        const id = request.params.id;
        if (id === undefined) {
            return response.status(400).json({
                error: "id missing"
            });
        }
        await Blog.findByIdAndRemove(id)
        response.status(204).end()
    } catch (exception) {
        console.log("delete blog", exception);
        response
            .status(400)
            .json({
                error: "delete blog something went wrong..."
            });
    }
});

module.exports = blogsRouter;