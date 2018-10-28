const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

const formatBlog = blog => {
    return {
        id: blog._id,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    };
};

blogsRouter.get("/", (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs.map(formatBlog));
    });
});

blogsRouter.post("/", (request, response) => {
    const body = request.body;

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
