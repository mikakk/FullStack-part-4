const supertest = require("supertest");
const {
    app,
    server
} = require("../index");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user")
const {
    initialBlogs,
    blogsInDbId,
    usersInDb
} = require("./test_helper")
//jest.setTimeout(1000);
describe("when there is initially some blogs saved", async () => {
    beforeAll(async () => {
        await Blog.deleteMany({});

        const blogObjects = initialBlogs.map(blog => new Blog(blog));
        const promiseArray = blogObjects.map(blog => blog.save());
        await Promise.all(promiseArray);
    });

    test("all blogs are returned as json", async () => {
        const blogsInDatabase = await blogsInDbId()
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body.length).toBe(blogsInDatabase.length)
        const returnedTitles = response.body.map(n => n.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    });

    test("all blogs are returned", async () => {
        const blogsInDatabase = await blogsInDbId()
        const response = await api.get("/api/blogs");
        expect(response.body.length).toBe(blogsInDatabase.length)
    });

    test("a specific blog is within the returned blogs", async () => {
        const response = await api.get("/api/blogs");
        const titles = response.body.map(r => r.title);
        expect(titles).toContain("title 2");
    });

    describe("addition of a new blog", async () => {
        test("a valid blog can be added", async () => {
            const newBlog = {
                title: "title 3",
                author: "author 3",
                url: "http://www.url3.com",
                likes: 3
            };

            const blogsBefore = await blogsInDbId()

            await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            const blogsAfter = await blogsInDbId()
            expect(blogsAfter.length).toBe(blogsBefore.length + 1)
            /* does not work, blogsAfter contains id, that newBlog does not have
            expect(blogsAfter).toContainEqual(newBlog) */
            expect(blogsAfter[blogsAfter.length - 1].title).toContain("title 3");
        });

        test("blog without title is not added", async () => {
            const newBlog = {
                author: "author 4",
                url: "http://www.url4.com",
                likes: 4
            };

            const blogsBefore = await blogsInDbId()

            await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(400);

            const blogsAfter = await blogsInDbId()
            expect(blogsAfter.length).toBe(blogsBefore.length)
        });

        test("blog with no likes will get 0", async () => {
            const newBlog = {
                title: "title 5",
                author: "author 5",
                url: "http://www.url5.com"
            };

            const blogsBefore = await blogsInDbId()

            await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(200);

            const blogsAfter = await blogsInDbId()
            expect(blogsAfter.length).toBe(blogsBefore.length + 1)

            const lastIndex = blogsAfter.length - 1;
            expect(blogsAfter[lastIndex].likes).toBe(0);
        });

        test("blog with no title and url", async () => {
            const newBlog = {
                author: "author 6",
                likes: 1
            };

            await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(400);
        });
    })

    describe("deletion of a blog", async () => {
        let newBlog

        beforeAll(async () => {
            newBlog = {
                title: "title delete",
                author: "author delete",
                url: "http://www.url-delete.com",
                likes: 1
            };
            await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(200);
        })

        test("DELETE /api/blogs/:id succeeds with proper statuscode", async () => {
            const blogsBefore = await blogsInDbId()
            const lastIndex = blogsBefore.length - 1;
            const lastId = blogsBefore[lastIndex].id;
            await api
                .delete(`/api/blogs/${lastId}`)
                .expect(204)

            const blogsAfter = await blogsInDbId()
            const titles = blogsAfter.map(r => r.title)
            expect(titles).not.toContain(newBlog.title)
            expect(blogsAfter.length).toBe(blogsBefore.length - 1)
        })
    })

    describe("update of a blog", async () => {
        test("PUT /api/blogs/:id succeeds with proper statuscode", async () => {
            const blogsBefore = await blogsInDbId()
            const lastIndex = blogsBefore.length - 1;
            const lastId = blogsBefore[lastIndex].id;
            const lastLikes = blogsBefore[lastIndex].likes;
            const editLikes = lastLikes + 1
            let editBlog = {
                likes: editLikes
            };
            await api
                .put(`/api/blogs/${lastId}`)
                .send(editBlog)
                .expect(200);

            const blogsAfter = await blogsInDbId()
            const lastLikesUpdate = blogsAfter[lastIndex].likes;
            expect(lastLikesUpdate).toBe(editLikes)
        })
    })
})

//describe.only("when there is initially one user at db", async () => {
describe("when there is initially one user at db", async () => {
    beforeAll(async () => {
        await User.deleteMany({})
        const user = new User({
            username: "root",
            name: "root",
            adult: true,
            password: "root"
        })
        await user.save()
    })

    test("POST /api/users succeeds with a fresh username", async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: "user1",
            name: "First Last",
            password: "qwerty"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
        const usernames = usersAfterOperation.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test("POST /api/users fails with proper statuscode and message if username already taken", async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body).toEqual({
            error: "username must be unique: root"
        })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test("POST /api/users does not accept short password", async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: "user2",
            name: "First Last",
            password: "1"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body).toEqual({
            error: "password must be at least 3 characters long"
        })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    afterAll(() => {
        server.close();
    });
})