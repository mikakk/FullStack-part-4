const Blog = require("../models/blog")
const User = require("../models/user")

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

const blogsInDbId = async () => {
    const blogs = await Blog.find({})
    return blogs.map(Blog.format)
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(User.format)
}

module.exports = {
    initialBlogs,
    blogsInDbId,
    usersInDb
}