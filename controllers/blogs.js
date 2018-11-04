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
            return response.status(400).json({ error: "title missing" });
        }
        if (body.author === undefined) {
            return response.status(400).json({ error: "author missing" });
        }
        if (body.url === undefined) {
            return response.status(400).json({ error: "url missing" });
        }
        if (body.likes === undefined) {
            return response.status(400).json({ error: "likes missing" });
        }
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes
        });

        const savedBlog = await blog.save();
        response.json(formatBlog(savedBlog));
    } catch (exception) {
        console.log("save blog", exception);
        response
            .status(500)
            .json({ error: "save blog something went wrong..." });
    }
});

module.exports = blogsRouter;
