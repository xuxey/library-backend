const dummy = (blogs) => {
    // noinspection PointlessArithmeticExpressionJS
    return blogs.length * 0 + 1;
}

const totalLikes = (blogs) => {
    let sum = 0;
    blogs.forEach(blog => sum += blog.likes)
    return sum;
}

// Get blog with highest likes
const favoriteBlog = (blogs) => {
    let blog = {likes: 0}
    blogs.forEach(b => {
        if (b.likes >= blog.likes)
            blog = b
    })
    return blog
}

const mostBlogs = (blogs) => {
    let authors = new Map();
    blogs.forEach(b => {
        if (authors.has(b.author))
            authors.set(b.author, authors.get(b.author) + 1);
        else
            authors.set(b.author, 1);
    })
    let max = {author: String, count: 0};
    authors.forEach((v, k) => {
        if (v > max.count) {
            max = {author: k, count: v}
        }
    })
    return {author: max.author, blogs: max.count}
}
const mostLikes = (blogs) => {
    let authors = new Map();
    blogs.forEach(b => {
        if (authors.has(b.author))
            authors.set(b.author, authors.get(b.author) + b.likes);
        else
            authors.set(b.author, b.likes);
    })
    let max = {author: String, count: 0};
    authors.forEach((v, k) => {
        if (v > max.count) {
            max = {author: k, count: v}
        }
    })
    return {author: max.author, likes: max.count}
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
