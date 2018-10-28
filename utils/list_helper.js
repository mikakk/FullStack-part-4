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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};
