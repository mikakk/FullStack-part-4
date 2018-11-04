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

test("a valid blog can be added", async () => {
    const newBlog = {
        title: "title 3",
        author: "author 3",
        url: "http://www.url3.com",
        likes: "3"
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const contents = response.body.map(r => r.title);

    expect(response.body.length).toBe(initialBlogs.length + 1);
    expect(contents).toContain("title 3");
});

test("blog without title is not added", async () => {
    const newBlog = {
        author: "author 4",
        url: "http://www.url4.com",
        likes: "4"
    };

    const initialBlogs = await api.get("/api/blogs");

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400);

    const response = await api.get("/api/blogs");

    expect(response.body.length).toBe(initialBlogs.body.length);
});

test("blog with no likes will get 0", async () => {
    const newBlog = {
        title: "title 5",
        author: "author 5",
        url: "http://www.url5.com"
    };

    const initialBlogs = await api.get("/api/blogs");

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(200);

    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(initialBlogs.body.length + 1);

    const lastIndex = response.body.length - 1;
    expect(response.body[lastIndex].likes).toBe(0);
});

afterAll(() => {
    server.close();
});
