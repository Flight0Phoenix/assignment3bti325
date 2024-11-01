const fs = require("fs");

let posts = [];
let categories = [];

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname + './data/posts.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                posts = JSON.parse(data);

                fs.readFile(__dirname + './data/categories.json', 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}

module.exports.getAllPosts = function(){
    return new Promise((resolve,reject)=>{
        (posts.length > 0 ) ? resolve(posts) : reject("no results returned"); 
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        (posts.length > 0) ? resolve(posts.filter(post => post.published)) : reject("no results returned");
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        (categories.length > 0 ) ? resolve(categories) : reject("no results returned"); 
    });
}
module.exports.addPost=function(postData){
    return new Promise((resolve,reject)=>{
        postData.published = postData.published === undefined ? false : true;
        postData.id = posts.length + 1;
        posts.push(postData);
        resolve(postData);
    })
}
module.exports.getPostsByCategories =function(category){
    return new promise((resolve,reject) => {
        const filteredPosts = post.filter(post => post.category == category);
        if (filteredPosts.length <= 0){
            resolve(filteredPosts);
        }
        else{
            reject("no results returned");
        }
    }
)};

module.exports.getPostsByDate=function(minDate){
    return new promise((resolve,reject) => {
        const filteredPosts = post.filter(post => post.minDate == minDate);
        if(new Date(somePostObj.postDate) >= new Date(minDateStr)){
            if(filteredPosts.length > 0){
                console.log("The postDate value is greater than minDateStr")
                resolve(filteredPosts);
            }}
    
    else{
            reject("no results returned");
        }
})};

module.exports.getPostByID=function(id){
    return new promise((resolve,reject) => {
        const filteredPosts = post.filter(post => post.id == id);
        if (filteredPosts.length <= 0){
            resolve(filteredPosts);
        }
        else{
            reject("no results returned");
            }
        }
    )};