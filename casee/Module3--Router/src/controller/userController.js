import fs from "fs";
import userService from "../service/userService.js";
import qs from "qs";
import url from "url";
import blogService from "../service/blogService.js";


class UserController {
    showAllAcc(req, res) {
        fs.readFile('view/user/listAccount.html', 'utf-8', (err, stringHTML) => {
            let str = '<table style="width: 1200px; border-collapse: collapse; border: 1px solid gray;">';
            userService.findAllAccount().then((user) => {
                str += `
      <tr style="font-weight: bold; font-size: 20px; background-color: #f2f2f2">
        <td>ID</td>
        <td>UserName</td>
        <td>Password</td>
        <td>Email</td>
        <td>Full Name</td>
        <td>Address</td>
        <td>Phone</td>
        <td>Role</td>
        <td>Image</td>
        <td colspan="2">Actions</td>
      </tr>
    `;

                user.forEach((item, index) => {
                    const rowColor = index % 2 === 0 ? '#ffffff' : '#f2f2f2'; // Alternating row colors

                    str += `
        <tr style="background-color: ${rowColor};">
          <td>${item.id}</td>
          <td>${item.username}</td>
          <td>${item.password}</td>
          <td>${item.email}</td>
          <td>${item.fullName}</td>
          <td>${item.address}</td>
          <td>${item.phone}</td>
          <td>${item.role}</td>
          <td>${item.image}</td>
          <td><button class="actedit" style="padding: 5px 10px; background-color: #4CAF50; color: white;"><a href="/user/edit?idEdit=${item.id}" style="text-decoration: none; color: white;">Edit</a></button></td>
          <td>
            <form method='POST' action='/delete'>
              <input type='hidden' name='idDelete' value='${item.id}'>
              <button class="act" type='submit' style="padding: 5px 10px; background-color: #f44336; color: white;border-radius: 5px">Delete</button>
            </form>
          </td>
        </tr>
      `;
                });

                str += '</table>';
                stringHTML = stringHTML.replace('{listAcc}', str);
                res.write(stringHTML);
                res.end();
            });
        });

    }

    showFormEdit(req, res) {
        let urlObject = url.parse(req.url, true)
        let data = '';
        req.on('data', dataRaw => {
            data += dataRaw;
        })
        req.on('end', () => {
            if (req.method === 'GET') {
                fs.readFile('view/user/editUser.html', 'utf-8', (err, stringHTML) => {
                    userService.findByIdUser(urlObject.query.idEdit).then((User) => {
                        stringHTML = stringHTML.replace("{id}", User.id)
                        stringHTML = stringHTML.replace("{username}", User.userName)
                        stringHTML = stringHTML.replace("{password}", User.password1)
                        stringHTML = stringHTML.replace("{email}", User.email)
                        stringHTML = stringHTML.replace("{image}", User.image);
                        stringHTML = stringHTML.replace("{fullName}", User.fullName);
                        stringHTML = stringHTML.replace("{address}", User.address);
                        stringHTML = stringHTML.replace("{phone}", User.phone);
                        stringHTML = stringHTML.replace("{role}", User.role);
                        // stringHTML = stringHTML.replace("{image}", User.popularityID);
                        res.write(stringHTML);
                        res.end();
                    })
                })
            } else {
                data = qs.parse(data);
                userService.update(data).then(() => {
                    res.writeHead(301, {'location': '/user/manager'})
                    res.end()
                })
            }
        })
    }


    delete(req, res) {
        let data = '';
        req.on('data', dataRaw => {
            data += dataRaw;
        })
        req.on('end', () => {
            if (req.method === 'GET') {
                this.showAllAcc(req, res);
            } else {

                data = qs.parse(data);
                const idDelete = data.idDelete;
                if (idDelete !== undefined) {
                    userService.delete(idDelete).then(() => {
                        res.writeHead(301, {'location': '/user/manager'})
                        res.end()
                    })
                }
            }
        })
    }

    edit(req, res) {
        if (req.session.role !== "ADMIN") {
            // Chỉ cho phép vai trò ADMIN chỉnh sửa thông tin tài khoản
            res.writeHead(403, {'Content-Type': 'text/plain'});
            res.write('Access denied');
            res.end();
            return;
        }

        // Xử lý yêu cầu chỉnh sửa thông tin tài khoản
        // ...
    }


    showFormLogin(req, res) {
        if (req.method === "GET") {
            fs.readFile('view/user/FormDangNhap.html', 'utf-8', (err, stringHTML) => {
                res.write(stringHTML);
                res.end();
            });
        } else if (req.method === "POST") {
            let data = '';
            req.on('data', dataRaw => {
                data += dataRaw;
            });
            req.on('end', () => {
                const formData = qs.parse(data);
                // Gọi hàm service để xử lý đăng nhập người dùng
                userService.checkLogin(formData.username, formData.password).then((data) => {
                    console.log(data)
                    if (data.length === 0) {
                        // Đăng nhập không thành công, chuyển hướng đến trang đăng ký
                        res.writeHead(301, {'Location': '/register'});
                        res.end();
                    } else {
                        if(data[0].role==='Admin'){
                            res.writeHead(301, {Location: '/user/manager'})
                            res.end()

                        }else {
                            fs.writeFile('userLogined', '' + data[0].id, err => {
                            });
                            res.writeHead(301, {Location: '/home'})
                            res.end()
                        }

                    }
                })
                    .catch((error) => {
                        // Xử lý lỗi nếu có
                        console.error(error);
                        // Trả về thông báo lỗi cho người dùng
                        res.writeHead(400, {'Content-Type': 'text/plain'});
                        res.write('Thông tin đăng nhập không chính xác');
                        res.end();
                    });
            });
        }
    }


    showFromRegister(req, res) {
        if (req.method === "GET") {
            fs.readFile('view/user/FormDangKy.html', 'utf-8', (err, stringHTML) => {
                res.write(stringHTML);
                res.end();
            });
        } else {
            let dataZ = '';
            req.on('data', dataRaw => {
                dataZ += dataRaw;
            });
            req.on('end', () => {
                const formData = qs.parse(dataZ);
                console.log(formData)
                // Gọi hàm service để xử lý đăng ký người dùng
                userService.addAccount(formData).then(() => {
                    // Đăng ký thành công, chuyển hướng về trang đăng nhập
                    res.writeHead(301, {'location': '/login'});
                    res.end();
                })

            });
        }
    }
}

export default new UserController();


// if(data.userName === "ADMIN" && data.password1 === "1234"){
//     fs.readFile('view/user/FormDangNhap.html', 'utf-8', (err, stringHTML) => {
//         res.write(stringHTML);
//         res.end();
//     })
// }
