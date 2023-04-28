"use strict";

$(function () {
    $("#tabs").tabs();
});

const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});
// display the current date for the movies
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${month}/${day}/${year}`;



// load the movies when the page loads
$(function () {
    // grab the section that will display the different movies
    let currentMovies = $("#movies");
    let imgUrl = `https://image.tmdb.org/t/p/w400/`;

    $.ajax({
        url: "https://api.themoviedb.org/3/movie/popular?api_key=c6213086042b80bb41c2e524a115907b&language=en-US&page=1",
        dataType: "json"
    }).done(function (data) {
        let html = `<h2>Most Popular Movies as of ${currentDate}</h2>`;

        for (let i = 0; i < 12; i++) {
            html += `<section class= "individualMovie"><img src="${imgUrl}${data.results[i].poster_path}" alt="${data.results[i].title}">
        <h3>${data.results[i].title}</h3><p>${data.results[i].overview}</p></section>`;
        }

        currentMovies.html(html);
    }).fail(function (jqXHR) {
        currentMovies.html("We were unable to load the movies from the movie database.");
        console.error(jqXHR.responseJSON.status_message);
    });

});

// get my currently watching shows
$(function () {
    // grab the section that will display the different movies
    let tvIds = ["125935", "111803", "75450", "1622", "73586"];
    let currentlyWatching = $("div.swiper-wrapper");
    let imgUrl = `https://image.tmdb.org/t/p/w400/`;
    let html = ``;
    // for each tv id provided, make an ajax request to display the image, name, and description
    for (let i = 0; i < tvIds.length; i++) {
        $.ajax({
            url: `https://api.themoviedb.org/3/tv/${tvIds[i]}?api_key=c6213086042b80bb41c2e524a115907b&language=en-US&page=1`,
            dataType: "json"
        }).done(function (data) {


            html += `<section class= "swiper-slide"><img src="${imgUrl}${data.backdrop_path}" alt="${data.original_name}">
            <h3>${data.original_name}</h3><p>${data.overview}</p></section>`;
            currentlyWatching.html(html);
        }).fail(function (jqXHR) {
            currentlyWatching.html("We were unable to load the movies from the movie database.");
            console.error(jqXHR.responseJSON.status_message);
        });
    }
});

let userMovies = [];
// this will store the users full name and their message
function storeUserInfo(e) {
    e.preventDefault();

    let outputP = document.getElementById("userSavedMessages");
    let userMessage = document.getElementById("message");

    userMessage.classList.remove("errorInput");
    // checking if the user entered anything
    if (userMessage.value === "") {
        userMessage.classList.add("errorInput");
        // making error styles and element visible
        document.getElementById("errorMessage").style.display = "block";
    }
    else {
        // grab the local storage element if it exists and put the message into it
        if (localStorage.getItem("message")) {
            userMovies.push(userMessage.value);
            localStorage.message = userMovies.join(",");
            showTvShows();

            userMessage.value = "";
        }
        // create a new local storage variable and put the message into it
        else {
            localStorage.setItem("message", userMessage.value);
            showTvShows();
            userMessage.value = "";

        }
    }
}

//  Show each tv show with an li tag
function showTvShows() {
    let tvlist = localStorage.getItem("message") || "";


    if (tvlist.length > 0) {
        // seperating each tv show
        userMovies = tvlist.split(",");

        // grabbing the ordered list element to show each tv show
        let olElement = document.getElementById("userSavedMessages");

        olElement.previousElementSibling.style.display = "block";

        olElement.innerHTML = "";
        // looping through each tv show and appending it the ol element
        for (let tvShow of userMovies) {
            let li = document.createElement("li");
            li.innerHTML = tvShow;
            olElement.appendChild(li);
        }
    }
}

// event handler for the form
document.getElementById("submitButton").addEventListener("click", storeUserInfo);