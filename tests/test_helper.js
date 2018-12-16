const Blog = require("../models/blog")

const initialBlogs = [{
        title: "title 1",
        author: "author 1",
        url: "http://www.url1.com",
        likes: 1
    },
    {
        title: "title 2",
        author: "author 2",
        url: "http://www.url2.com",
        likes: 2
    }
];

const format = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
}

const formatId = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        id: blog._id
    }
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(format)
}

const blogsInDbId = async () => {
    const blogs = await Blog.find({})
    return blogs.map(formatId)
}

module.exports = {
    initialBlogs,
    blogsInDb,
    blogsInDbId
}