const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user")
const jwt = require("jsonwebtoken")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1
    });
    response.json(blogs.map(Blog.format));
});

blogsRouter.post("/", async (request, response) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({
                error: "token missing or invalid"
            })
        }

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

        const user = await User.findById(decodedToken.id);

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: likes,
            user: user._id
        });

        const savedBlog = await blog.save();

        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();

        response.json(Blog.format(savedBlog));
    } catch (exception) {
        if (exception.name === "JsonWebTokenError") {
            response.status(401).json({
                error: exception.message
            })
        } else {
            console.log("save blog exception:", exception)
            response.status(500).json({
                error: "save blog something went wrong..."
            })
        }
    }
});

blogsRouter.delete("/:id", async (request, response) => {
    let decodedToken = null
    try {
        decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({
                error: "token missing or invalid"
            })
        }
    } catch (exception) {
        if (exception.name === "JsonWebTokenError") {
            return response.status(401).json({
                error: exception.message
            })
        }
    }

    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== decodedToken.id) {
        response
            .status(400)
            .json({
                error: "blog delete from wrong user."
            });
    }

    try {
        await Blog.findByIdAndRemove(request.params.id)
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

blogsRouter.put("/:id", async (request, response) => {
    const body = request.body
    let blog = {
        likes: body.likes
    };

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
            new: true
        })
        response.json(Blog.format(updatedBlog));
    } catch (exception) {
        console.log("update blog", exception);
        response
            .status(400)
            .json({
                error: "update blog something went wrong..."
            });
    }
})

module.exports = blogsRouter;