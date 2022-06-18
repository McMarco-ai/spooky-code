import * as categories from "../models/CategoryModel.js";
import * as User from "../models/UserModel.js";


//Setup the categories

let selectedSubCategory;
let selectedCategory;
let currentUser = User.getUserLogged()

wikiView()

function wikiView() {
    categories.init();
    User.init()

    let totalCategories = categories.getCategories();

    let categoriesDiv = document.querySelector(".categoriesDiv")

    for (let i = 0; i < totalCategories.length; i++) {
        categoriesDiv.innerHTML += `<p class="levelNeeded">Level ${totalCategories[i].levelNeeded}</p>`
        categoriesDiv.innerHTML += `<p class="categoryNotSelected">${totalCategories[i].title}</p>`
        totalCategories[i].subCategories.forEach(subCategory => {
            categoriesDiv.innerHTML += `<div><p class="subCategoryNotSelected">${subCategory.title}</p></div>`
        });
        selectedSubCategory = totalCategories[0].subCategories[0]
        selectedCategory = totalCategories[0]
    }


    let totalCategoriesHtml = document.querySelectorAll(".categoryNotSelected")


    //Default
    totalCategoriesHtml[0].classList.replace("categoryNotSelected", "categorySelected")

    //Setup changing SubCategory and Category

    let totalSubCategories = document.querySelectorAll(".subCategoryNotSelected")

    totalSubCategories.forEach(subCategory => {
        //This will select the first SubCategory of the 
        if (selectedSubCategory.title == subCategory.innerHTML) {
            subCategory.classList.replace("subCategoryNotSelected", "subCategorySelected")
        }
        subCategory?.addEventListener("click", () => {
            //Cleaning prev selected subCategories
            totalSubCategories.forEach(subCategorySelected => {

                subCategorySelected.classList.replace("subCategorySelected", "subCategoryNotSelected")
            });
            totalCategoriesHtml.forEach(categorySelected => {

                categorySelected.classList.replace("categorySelected", "categoryNotSelected")
            });

            //Find the subCategory object with the same title
            selectedSubCategory = categories.getSubCategoryByName(subCategory.innerHTML)
            selectedCategory = categories.checkWhereSubCategoryIs(subCategory.innerHTML)
            updateData()
            subCategory.classList.replace("subCategoryNotSelected", "subCategorySelected")
            totalCategoriesHtml.forEach(category => {
                if (category.innerHTML == selectedCategory.title) {
                    category.classList.replace("categoryNotSelected", "categorySelected")
                }
            });
        });
    });

        // Register Mechanism
        document.querySelector(".postComment")?.addEventListener("click", (event) => {
            event.preventDefault();
           let textArea = document.querySelector("#commentTextArea")
            try {
                let comment = textArea.value
                if (comment.length > 0) {
                    let date = Date.now()
                    let today = new Date(date);
                    categories.commentOnSubCategory(selectedSubCategory, comment,currentUser.username,today.toLocaleDateString())
                    updateData()
                }
            } catch (e) {
                console.log(e);
            }
        });

    updateData()
}

function updateData() {
    //Video Related Stuff

    let video = document.querySelector("#myVideo")
    let source = document.querySelector(".videoSource")

    //URL

    source.src = selectedSubCategory.url
    video.load();


    //Setup the Video Url

    //Setup the Video Data

    //Views

    let viewsVideo = document.querySelector(".viewsVideo")
    viewsVideo.innerHTML = `${selectedSubCategory.views} views`

    //Date Added

    let dateAdded = document.querySelector(".dateVideoAdded")
    dateAdded.innerHTML = `| ${selectedSubCategory.dateAdded}`

    //Likes

    let likeIcon = document.querySelector("#likeBtn")

    //Keep the like on reload

    if (currentUser.likes.includes(selectedSubCategory.title)) {
        likeIcon.classList.replace("fa-regular", "fa-solid")
    } else {
        likeIcon.classList.replace("fa-solid", "fa-regular")
    }

    likeIcon?.addEventListener("click", () => {
        if (likeIcon.classList.contains("fa-regular")) {
            selectedSubCategory.likes++;
            likeIcon.classList.replace("fa-regular", "fa-solid")
            categories.updateCategories(selectedSubCategory)
            User.setLikes(selectedSubCategory.title, "add")
        } else {
            selectedSubCategory.likes--;
            likeIcon.classList.replace("fa-solid", "fa-regular")
            categories.updateCategories(selectedSubCategory)
            User.setLikes(selectedSubCategory.title, "remove")
        }
        likes.innerHTML = `${selectedSubCategory.likes}`
    });

  
    let likes = document.querySelector(".likes")
    likes.innerHTML = `${selectedSubCategory.likes}`

    //Setup the Tags

    let divTags = document.querySelector(".tags")

    divTags.innerHTML = ""

    selectedSubCategory.tags.forEach(tag => {
        divTags.innerHTML += `<div class = "tagContainer"><p class="tag">${tag}</p></div>`
    });

    let tags = document.querySelectorAll(".tag")

    tags.forEach(tag => {
        tag?.addEventListener("click", () => {
            let tagInnerhtml = tag.innerHTML
            tagInnerhtml = tagInnerhtml.split("-")[0]
            tagInnerhtml = tagInnerhtml.split(":")
            let minutes = parseInt(tagInnerhtml[0])
            let seconds = parseInt(tagInnerhtml[1])
            let time = minutes * 60 + seconds
            if(time > 0){
                video.currentTime = time
                video.play()
            }
        });
    });

    //Setup the Video Tags

    let divVideoTags = document.querySelector(".videoTags")

    divVideoTags.innerHTML = ""
    selectedSubCategory.videoTags.forEach(tag => {
        divVideoTags.innerHTML += `<p class="videoTag">${tag}</p>`
    });

    let videoTags = document.querySelectorAll(".videoTag")

    videoTags.forEach(tag => {
        tag?.addEventListener("click", () => {
            let tagInnerhtml = tag.innerHTML
            tagInnerhtml = tagInnerhtml.split("-")[0]
            tagInnerhtml = tagInnerhtml.split(":")
            let minutes = parseInt(tagInnerhtml[0])
            let seconds = parseInt(tagInnerhtml[1])
            let time = minutes * 60 + seconds
            if(time > 0){
                video.currentTime = time
                video.play()
            }
        });
    });

    //Setup the Comments

    let totalComments = document.querySelector(".totalComments")
    totalComments.innerHTML = `${selectedSubCategory.comments.length} Comments`

    //Setup the Comment List

    let comments = document.querySelector(".comments")
    console.log(selectedSubCategory);
    comments.innerHTML = ""
    selectedSubCategory.comments.forEach(comment => {
        comments.innerHTML += `<div class="commentContainer">
        <p class="comment">${comment.comment}</p>
        <p class="comment">${comment.date}</p>
        <p class="commentAuthor">${comment.user}</p>
        </div>`
        
    });

}