let selectedPet = "";
const prefButton = document.getElementById("pref_btn");
const generateBtn = document.getElementById("generateBtn");
const icon = document.getElementById("fav-icn");

// icon.classList.add("disabled");

document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (event) => {
        event.preventDefault();

        selectedPet = event.target.getAttribute("data-pet").toLowerCase();
        console.log("Selected Pet:", selectedPet);
        const selectedPref = event.target.textContent.trim();
        const selectedImg = event.target.querySelector("img").src;

        prefButton.innerHTML = `<img src="${selectedImg}" width="30" height="30" style="margin-right: 5px;"> ${selectedPref}`;
        document.getElementById("fact").textContent = selectedPet === "dog" ? "Dog Facts" : "Cat Facts";
    });
});

generateBtn.addEventListener("click", async () => {
    if (!selectedPet) {
        iziToast.error({
            title: 'Error',
            message: 'Please select a pet type first!',
            position: 'bottomRight',
            backgroundColor: '#db6217',
            messageColor: '#fff',
            progressBarColor: 'cf6829'
        });
        return;
    }

    try {   

        document.querySelector(".dflt-head").style.display = "none";
        generateBtn.disabled = true;
        document.querySelector(".loadingspinner").style.display = "block";

        const response = await fetch(`/api/${selectedPet}`);
        const data = await response.json();

        document.querySelector(".loadingspinner").style.display = "none";
        document.querySelector(".api-img").src = data.petImage;

        const factElement = document.getElementById("typing-text");
        factElement.textContent = "";
        typeText(factElement, data.petFact, 50);

        
        icon.classList.remove("disabled");
        
        generateBtn.disabled = false;
    } catch (error) {
        generateBtn.disabled = false;
        console.error("Error fetching new data:", error);
    }
});

function typeText(element, text, speed) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

document.querySelector(".icn").addEventListener("click", () => {
    fetch("/save/pet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            petType: selectedPet,
            imageURL: document.querySelector(".api-img").src,
            fact: document.getElementById("typing-text").textContent
        }),
    })
        .then(response => response.json())
        .then(() => {
            console.log("Data Sent To Database");
            iziToast.success({
                title: 'Success',
                message: 'Pet added to favorites!',
                position: 'bottomRight',
                backgroundColor: '#db6217',
                messageColor: '#fff',
                progressBarColor: 'cf6829'
            });
        })
        .catch(err => {
            console.error("Error sending data:", err);
        });
});

document.getElementById("saved").addEventListener("click", () => {
    window.location.href = "/saved";
})