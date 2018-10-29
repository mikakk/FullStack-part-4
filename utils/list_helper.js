const dummy = blogs => {
    return 1;
};

const totalLikes = blogs => {
    //return Object.values(blogs).reduce((t, n) => t + n.likes, 0);
    const reducer = (sum, item) => {
        return sum + item.likes;
    };
    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return 0;
    }
    let max = blogs[0].likes;
    let index = 0;
    for (let i = 1, len = blogs.length; i < len; i++) {
        if (blogs[i].likes > max) {
            max = blogs[i].likes;
            index = i;
        }
    }
    return {
        title: blogs[index].title,
        author: blogs[index].author,
        likes: blogs[index].likes
    };
};

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return 0;
    }
    let authors = {}; //must be object, array does not work
    for (let i = 0, len = blogs.length; i < len; i++) {
        if (authors[blogs[i].author] === undefined) {
            //new author
            authors[blogs[i].author] = {
                author: blogs[i].author,
                blogs: 1,
                likes: blogs[i].likes
            };
        } else {
            //increment author
            authors[blogs[i].author].blogs++;
            authors[blogs[i].author].likes += blogs[i].likes;
        }
    }
    //find author with most blogs
    const keys = Object.keys(authors);
    let max = authors[keys[0]];
    for (let key of keys) {
        if (authors[key].blogs > max.blogs) {
            max = authors[key];
        }
    }
    return { author: max.author, blogs: max.blogs };
};

const mostLikes = blogs => {
    if (blogs.length === 0) {
        return 0;
    }
    let authors = {}; //must be object, array does not work
    for (let i = 0, len = blogs.length; i < len; i++) {
        if (authors[blogs[i].author] === undefined) {
            //new author
            authors[blogs[i].author] = {
                author: blogs[i].author,
                blogs: 1,
                likes: blogs[i].likes
            };
        } else {
            //increment author
            authors[blogs[i].author].blogs++;
            authors[blogs[i].author].likes += blogs[i].likes;
        }
    }
    //find author with most likes
    const keys = Object.keys(authors);
    let max = authors[keys[0]];
    for (let key of keys) {
        if (authors[key].likes > max.likes) {
            max = authors[key];
        }
    }
    return { author: max.author, likes: max.likes };
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
