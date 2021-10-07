(() => {
    const slideshow = {
        delay: 3000,
        items: [],
        URL: "slideshow.json",
        intervalID: null,
        init: function () {

            let contentDiv = document.createElement("div");
            contentDiv.classList.add("content");
            document.querySelector(".slideshow").appendChild(contentDiv);

            // lets load css files as well
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "styles.css";
            document.head.appendChild(link);


            slideshow.loadData(slideshow.URL);
        },
        loadData: function (url) {
            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    slideshow.loadContents(data);
                })
                .catch((err) => {
                    console.log("ERROR: ", err);
                })
        },
        loadContents: function (data) {
            let df = new DocumentFragment();

            data.items.forEach((item, index) => {
                let div = slideshow.createItem(item.title, item.img, item.msg, index);
                df.appendChild(div);
            })
            document.querySelector(".content").appendChild(df);

            // display current slide to the document
            document.querySelector(".slideshow-item").classList.add("current");

            // nodelist to array via destructuring
            slideshow.items = [...document.querySelectorAll(".slideshow-item")];

            // buttons
            let content2 = document.createElement("div");
            content2.classList.add("slideshow-controller")
            content2.innerHTML += `<i class="fas fa-backward"></i><i class="fas fa-pause"></i><i class="fas fa-forward"></i>`;

            document.querySelector(".slideshow").appendChild(content2);
            document.querySelectorAll(".slideshow-controller i")
            slideshow.handleClicks();

            slideshow.start();


        },
        createItem: function (title, _img, msg, index) {
            let div = document.createElement("div");
            div.setAttribute("data-index", index);
            div.classList.add("slideshow-item")
            let h1 = document.createElement("h1");
            let img = document.createElement("img");
            let p = document.createElement("p");
            h1.textContent = title;
            img.src = "./images/" + _img;
            p.textContent = msg;
            [h1, img, p].forEach((child) => {
                div.appendChild(child);
            })
            return div;
        },
        start: function () {
            slideshow.intervalID = setInterval(() => {
                let [first, ...rest] = slideshow.items;
                slideshow.items = [...rest, first];
                slideshow.switchItem(0);
            }, slideshow.delay)
        },
        switchItem: function (index) {

            let activeSlide = document.querySelector(".current");
            activeSlide.classList.remove("current");
            activeSlide.classList.add("leaving");
            setTimeout(() => {
                activeSlide.classList.remove("leaving");
            }, 800)
            slideshow.items[index].classList.add("current");
        },
        handleClicks: function () {
            // pause and play
            let controlButtons = document.querySelectorAll("i");
            controlButtons[1].addEventListener("click", function (event) {
                let classList = event.currentTarget.classList;
                if (classList.contains("fa-play")) {
                    // i wanna play
                    slideshow.start();
                    classList.remove("fa-play");
                    classList.add("fa-pause");
                } else {
                    // wanna pause
                    clearInterval(slideshow.intervalID);
                    classList.remove("fa-pause");
                    classList.add("fa-play");
                }
            })

            // back button
            controlButtons[0].addEventListener("click", function () {
                let last = slideshow.items.pop();
                slideshow.items.unshift(last);
                slideshow.switchItem(0);
            })

            controlButtons[2].addEventListener("click", function () {
                console.log(slideshow.items);
                let first = slideshow.items[0];
                let remaining = slideshow.items.slice(1);
                remaining.push(first);
                slideshow.items = remaining;
                slideshow.switchItem(0);

            })
        },
        changeDelay: function (delay) {
            // this function i am not using but this can be used for adding delay feature
            slideshow.delay = delay;
        }

    }
    document.addEventListener('DOMContentLoaded', slideshow.init);

})();




















