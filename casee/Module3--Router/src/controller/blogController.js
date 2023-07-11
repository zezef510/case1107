import fs from "fs";
import qs from "qs";
import url from "url";
import blogService from "../service/blogService.js";

class BlogController {

    showAll(req, res) {
        let data = '';
        req.on('data', dataRaw => {
            data += dataRaw;
        })
        req.on('end', () => {
            if (req.method === 'GET') {
                showList(req, res);
            } else {
                data = qs.parse(data);
                blogService.save(data).then(() => {
                    showList(req, res);
                })
            }
        })
    }

    showFormEdit(req, res) {
        fs.readFile('view/blog/edit.html', 'utf-8', (err, stringHTML) => {
            let data = '';
            req.on('data', dataRaw => {
                data += dataRaw;
            })
            req.on('end', () => {
                if (req.method === 'GET') {
                    let urlObject = url.parse(req.url, true);
                    blogService.findById(urlObject.query.idEdit).then((blog) => {
                        console.log(blog)
                        stringHTML = stringHTML.replace('{idBlog}', blog.idBlog)
                        stringHTML = stringHTML.replace('{category}', blog.category)
                        stringHTML = stringHTML.replace('{imageBlog}', blog.imageBlog)
                        stringHTML = stringHTML.replace('{title}', blog.title)
                        stringHTML = stringHTML.replace('{status}', blog.status)
                        stringHTML = stringHTML.replace('{shortDescription}', blog.shortDescription)
                        stringHTML = stringHTML.replace('{detailBlog}', blog.detailBlog)
                        stringHTML = stringHTML.replace('{startTime}', blog.startTime)
                        stringHTML = stringHTML.replace('{idUser}', blog.idUser)
                        res.write(stringHTML);
                        res.end();
                    })
                } else {
                    data = qs.parse(data);
                    blogService.update(data).then(() => {
                        showListUser(req, res,data)
                    })
                }
            })
        })
    }

    showFormAdd(req, res) {
        fs.readFile('view/blog/add.html', 'utf-8', (err, stringHTML) => {
            let urlObject = url.parse(req.url, true);
            console.log(urlObject.query.id, 0)
            stringHTML = stringHTML.replace('{idUser}', urlObject.query.id)
            res.write(stringHTML);
            res.end();
        })
    }

    showFormDelete(req, res) {
        let urlObject = url.parse(req.url, true);
        blogService.delete(urlObject.query.id).then()
        blogService.findById(urlObject.query.id).then((data)=>{
                console.log(data,0)
                showListUser(req, res,data)
        })
    }
    showByUser(req, res) {
        let data = '';
        req.on('data', dataRaw => {
            data += dataRaw;
        })
        req.on('end', () => {
            if (req.method === 'GET') {

                fs.readFile('view/blog/listByUser.html', 'utf-8', (err, stringHTML) => {
                    let urlObject = url.parse(req.url, true);
                    let str = '';
                    blogService.findByUser(urlObject.query.id).then((blogs) => {
                        console.log(urlObject.query.id,0)
                        for (const blog of blogs) {
                            str += `
            
              
           
               <div class="row blog-item px-3 pb-5">
        <div class="col-md-5">
          <img class="img-fluid mb-4 mb-md-0" src="${blog.imageBlog}" alt="Image">
        </div>
        <div class="col-md-7">
          <h3 class="mt-md-4 px-md-3 mb-2 py-2 bg-white font-weight-bold">${blog.title}</h3>
          <div class="d-flex mb-3">
          
            <small class="mr-2 text-muted">${blog.fullName}</small>
            <small class="mr-2 text-muted"><i class="fa fa-calendar-alt"></i> 01-Jan-2045</small>
            <small class="mr-2 text-muted"><i class="fa fa-folder"></i> Web Design</small>
            <small class="mr-2 text-muted"><i class="fa fa-comments"></i> 15 Comments</small>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu suscipit orci velit id libero
          </p>
          <div class="button-row">
                  <a onclick="return window.confirm('Are you sure you want to edit')" href="/edit-blog?idEdit=${blog.idBlog}">
                    <button>Edit</button>
                  </a>
                  <a onclick="return window.confirm('Are you sure you want to delete')" href="/delete-blog?id=${blog.idBlog}">
                    <button>Delete</button>
                  </a>
                  <a href="/bogs-user?idBlog=${blog.id}" >Read More</a>
                </div>
        </div>
      </div>
            `;
                        }
                        str += `<a onclick="return window.confirm('Are you sure you want to add')" href="/add-blog?id=${urlObject.query.id}"><button>ADD</button></a>`
                        stringHTML = stringHTML.replace('{listByUser}', str);
                        res.write(stringHTML);
                        res.end();
                    })
                })

            } else {
                data = qs.parse(data);
                blogService.save(data).then(() => {
                    showListUser(req,res,data)
                })
            }
        })
    }




}

function showList(req, res) {
    fs.readFile('view/blog/list.html', 'utf-8', (err, stringHTML) => {
        let str = '';
        blogService.findAll().then((blogs) => {
            for (const blog of blogs) {
                str += `<h3><img src="${blog.imageBlog}">,${blog.title},${blog.fullName}
            
 </h3>`
            }
            stringHTML = stringHTML.replace('{list}', str)
            res.write(stringHTML);
            res.end();
        })
    })
}

function showListUser(req, res,data) {
    fs.readFile('view/blog/listByUser.html', 'utf-8', (err, stringHTML) => {
        let str = '';
        blogService.findByUser(data.idUser).then((blogs) => {
            console.log(blogs)
            for (const blog of blogs) {
                str += `<h3><img src="${blog.imageBlog}">,
                                 ${blog.title},${blog.fullName}<br>
                               <a onclick="return window.confirm('Are you sure you want to edit')" 
                               href="/edit-blog?idEdit=${blog.idBlog}"><button>Edit</button></a>
                               <br>
                               
                               <a onclick="return window.confirm('Are you sure you want to edit')" 
                               href="/delete-blog?id=${blog.idBlog}"><button class="button"> Delete</button></a>
                               <a href="/bogs-user?idBlog=${blog.idBlog}">Read More</a>
                               </h3>`
            }
            str += `<a onclick="return window.confirm('Are you sure you want to edit')" href="/add-blog?id=1"><button>ADD</button></a>`
            stringHTML = stringHTML.replace('{listByUser}', str)
            res.write(stringHTML);
            res.end();
        })
    })
}

export default new BlogController();
