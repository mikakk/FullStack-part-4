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

blogsRouter.post("/", (request, response) => {
    const body = request.body;

    if (body.title === undefined) {
        response.status(400).json({ error: "title missing" });
    }
    if (body.author === undefined) {
        response.status(400).json({ error: "author missing" });
    }
    if (body.url === undefined) {
        response.status(400).json({ error: "url missing" });
    }
    if (body.likes === undefined) {
        response.status(400).json({ error: "likes missing" });
    }
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    });

    blog.save()
        .then(blog => {
            return formatBlog(blog);
        })
        .then(formattedBlog => {
            response.json(formattedBlog);
        });
});

module.exports = blogsRouter;
