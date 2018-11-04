const supertest = require("supertest");
const { app, server } = require("../index");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
    {
        title: "title 1",
        author: "author 1",
        url: "http://www.url1.com",
        likes: "1"
    },
    {
        title: "title 2",
        author: "author 2",
        url: "http://www.url2.com",
        likes: "2"
    }
];

beforeAll(async () => {
    await Blog.deleteMany({});

    const blogObjects = initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");
    const titles = response.body.map(r => r.title);
    expect(titles).toContain("title 2");
});

afterAll(() => {
    server.close();
});
