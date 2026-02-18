let file = document.getElementById("file");
let button = document.getElementById("btn");
let resultsDiv = document.getElementById("results");
let box = document.getElementById("results-box");

let fr = 0;
let followingUsernames = [];
let followersUsernames = [];
let notFollowingBack = [];

box.style.opacity = "0";

/*TO LOAD SAVED SESSION */

window.addEventListener("load", function () {
    let saved = localStorage.getItem("notFollowingBack");
    if (!saved) return;

    notFollowingBack = JSON.parse(saved);
    resultsDiv.innerHTML = "";

    notFollowingBack.forEach(username => {
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = username.href;
        a.textContent = "@" + username.title;
        resultsDiv.appendChild(a);
    });

    let total = document.getElementById("total");
    total.textContent =
        "Users not following back : " + notFollowingBack.length;

    box.style.opacity = "1";
});

/* FILE LIST UI */

const updateList = function () {
    let input = document.getElementById("file");
    let output = document.getElementById("fileList");
    let children = "";

    for (let i = 0; i < input.files.length; i++) {
        children += "<li>" + input.files.item(i).name + "</li>";
    }

    output.innerHTML =
        "<p>Selected files</p><ul>" + children + "</ul>";

    if (input.files.length == 2) {
        button.disabled = false;
    }
};

/* MAIN CODE */

button.addEventListener("click", function () {
    fr = 0;
    followingUsernames = [];
    followersUsernames = [];
    notFollowingBack = [];
    resultsDiv.innerHTML = "";

    for (let i = 0; i < 2; i++) {
        let reader = new FileReader();
        reader.readAsText(file.files[i]);

        reader.onload = function () {
            let data = JSON.parse(reader.result);

            if (data.relationships_following) {
                let user = data.relationships_following;
                let j = 0;

                while (j < user.length) {
                    followingUsernames.push({
                        title: user[j].title,
                        href:
                            "https://www.instagram.com/" +
                            user[j].title +
                            "/"
                    });
                    j++;
                }
            } else {
                let user = data;
                let k = 0;

                while (k < user.length) {
                    followersUsernames.push(
                        user[k].string_list_data[0].value
                    );
                    k++;
                }
            }

            fr++;

            if (fr === 2) {
                let followersSet = new Set(followersUsernames);

                followingUsernames.forEach(follow => {
                    if (!followersSet.has(follow.title)) {
                        notFollowingBack.push(follow);
                    }
                });

                resultsDiv.innerHTML = "";

                notFollowingBack.forEach(username => {
                    let a = document.createElement("a");
                    a.target = "_blank";
                    a.href = username.href;
                    a.textContent = "@" + username.title;
                    resultsDiv.appendChild(a);
                });

                let total = document.getElementById("total");
                total.textContent =
                    "Users not following back : " +
                    notFollowingBack.length;

                box.style.opacity = "1";

                localStorage.setItem(
                    "notFollowingBack",
                    JSON.stringify(notFollowingBack)
                );
            }
        };
    }
});
