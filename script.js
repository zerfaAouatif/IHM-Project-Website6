const wastes = [
    { name: "صحيفة", emoji: "📰", type: "paper" },
    { name: "زجاجة ماء", emoji: "🥤", type: "plastic" },
    { name: "قنينة زجاج", emoji: "🍾", type: "glass" },
    { name: "قشر موز", emoji: "🍌", type: "organic" }
];

let score = 0;
let tries = 0;

const itemsBox = document.getElementById("items");
const scoreEl = document.getElementById("score");
const triesEl = document.getElementById("tries");

function loadItems() {
    itemsBox.innerHTML = "";
    wastes.forEach((w, i) => {
        const div = document.createElement("div");
        div.className = "item";
        div.draggable = true;
        div.dataset.type = w.type;

        div.innerHTML = `
            <span>${w.emoji}</span>
            <small>${w.name}</small>
        `;

        div.addEventListener("dragstart", dragStart);
        div.addEventListener("dragend", dragEnd);

        itemsBox.appendChild(div);
    });
}

function dragStart(e) {
    e.dataTransfer.setData("type", e.target.dataset.type);
    e.target.classList.add("dragging");
}

function dragEnd(e) {
    e.target.classList.remove("dragging");
}

const bins = document.querySelectorAll(".bin");

bins.forEach(bin => {
    bin.addEventListener("dragover", e => {
        e.preventDefault();
        bin.classList.add("highlight");
    });

    bin.addEventListener("dragleave", () => {
        bin.classList.remove("highlight");
    });

    bin.addEventListener("drop", e => {
        bin.classList.remove("highlight");

        const draggedType = e.dataTransfer.getData("type");
        const binType = bin.dataset.type;

        tries++;
        triesEl.textContent = tries;

        if (draggedType === binType) {
            score++;
            scoreEl.textContent = score;
            alert("✔️ أحسنت!");
        } else {
            alert("❌ خطأ! حاول مجددًا");
        }
    });
});

document.getElementById("restart").addEventListener("click", () => {
    score = 0;
    tries = 0;
    scoreEl.textContent = 0;
    triesEl.textContent = 0;
    loadItems();
});

loadItems();
