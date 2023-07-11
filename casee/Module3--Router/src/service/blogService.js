import connection from "../connection.js";


class BlogService {
    cate
    constructor() {
        connection.connecting();
    }

    findAll() {
        return new Promise((resolve, reject) => {
            let sql= 'select * from blog'
            sql+=' join user on blog.idUser = user.id'
            connection.getConnection().query(sql, (err, blogs) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(blogs)
                }
            })
        })
    }
    findByUser(id){
        return new Promise((resolve, reject) => {
            let sql= `select * from blog`
            sql+=` join user on blog.idUser = user.id where user.id = ${id}`
            connection.getConnection().query(sql, (err, blogs) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(blogs)
                }
            })
        })
    }

    save(blog) {

        return new Promise((resolve, reject) => {
            connection.getConnection().query(`INSERT INTO blog (category, imageBlog, title, status, shortDescription, detailBlog, startTime, idUser)VALUES ('${blog.category}', '${blog.imageBlog}', '${blog.title}', '${blog.status}', '${blog.shortDescription}', '${blog.detailBlog}', '${blog.startTime}',${blog.idUser})`, (err, blogs) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(blogs)
                }
            })
        })
    }


    findById(id) {
        return new Promise((resolve, reject) => {
            connection.getConnection().query(`select * from blog where idBlog = ${id}`,(err, blogs) => {
                if(err){
                    reject(err)
                } else {

                    resolve(blogs[0])
                }
            })
        })
    }
    update (blog){
        return new Promise((resolve, reject) => {
            connection.getConnection().query(`update blog Set category ='${blog.category}',imageBlog ='${blog.imageBlog}',title ='${blog.title}',status ='${blog.status}',shortDescription='${blog.shortDescription}', detailBlog='${blog.detailBlog}', startTime='${blog.startTime}' where idBlog= ${blog.idBlog}`,(err, result) => {
                if(err){
                    reject(err)
                } else {
                    console.log(`update thanh cong`)
                    resolve(result)
                }
            })
        })
    }
    delete (id){
        return new Promise((resolve, reject) => {
            connection.getConnection().query(`delete from blog where idBlog= ${id} `,(err, result) => {
                if(err){
                    reject(err)
                } else {
                    console.log(`xoá thành cong`)
                    resolve(result)
                }
            })
        })

    }
}

export default new BlogService();
