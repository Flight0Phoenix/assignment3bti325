const express = require('express');
const blogData = require("./blog-service");
const path = require("path");
const app = express();
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer(); // no { storage: storage }

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect("/about");
});

app.get('/posts/add', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'views', 'addPost.html'));
});

app.post('/posts/add', upload.single('featureImage'), async (req, res) => {
    if(req.file){
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
        if (result) {
        resolve(result);
        } else {
        reject(error);
        }
        }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
        };
    async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
    }
    upload(req).then((uploaded) => {
        req.body.featureImage = uploaded.url; 
        blogData.addPost(req.body).then(() => {
            res.redirect('/posts/add');
        }).catch(err => {
            console.error("Post could not be uploaded");
            res.status(400).send("Try again");
        });
    });
}});
cloudinary.config({
    cloud_name: 'dwaomdsjs',
    api_key: '379211389359351',
    api_secret: 'w23ygedW566h3ozPAYoo2qSOBB8',
    secure: true
    });

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get('/blog', (req,res)=>{
    blogData.getPublishedPosts().then((data=>{
        res.json(data);
    })).catch(err=>{
        res.json({message: err});
    });
});

app.get('/posts/add', (req, res) =>
    {
        res.sendFile(path.join(__dirname, 'views/addPost.html'));
    } 
);
app.get('/posts', (req,res)=>{
    const category = req.query.category;
    const minDate = req.query.minDate;
    
    if (category) {
        blogData.getPostsByCategory(category).then(data => res.json(data)).catch(err => res.json({ message: err }));
    } 
    else if (minDate) 
        {
        blogData.getPostsByMinDate(minDate).then(data => res.json(data)).catch(err => res.json({ message: err }));
    } else {
        blogData.getAllPosts().then(data => res.json(data)).catch(err => res.json({ message: err }));
    }
});
app.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    blogData.getPostById(id)
        .then(data => res.json(data))
        .catch(err => res.json({ message: err }));
});

app.get('/categories', (req,res)=>{
    blogData.getCategories().then((data=>{
        res.json(data);
    })).catch(err=>{
        res.json({message: err});
    });
});

app.use((req,res)=>{
    res.status(404).send("404 - Page Not Found")
})

blogData.initialize().then(()=>{
    app.listen(HTTP_PORT, () => { 
        console.log('server listening on: ' + HTTP_PORT); 
    });
}).catch((err)=>{
    console.log(err);
})
