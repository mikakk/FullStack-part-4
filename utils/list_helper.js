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

module.exports = {
    dummy,
    totalLikes
};
