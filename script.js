function checkAnswer(num) {

    let correctAnswers = {
        1: "بلاستيك",
        2: "زجاج",
        3: "ورق",
        4: "معدن",
        5: "ورق",
        6: "عضوي",
        7: "معدن",
        8: "بلاستيك",
        9: "ورق"
    };

    let input = document.getElementById("answer" + num).value.trim();
    let result = document.getElementById("result" + num);

    if (input === correctAnswers[num]) {
        result.style.color = "green";
        result.textContent = "إجابة صحيحة 🎉 أحسنت!";
    } else {
        result.style.color = "red";
        result.textContent = "إجابة خاطئة ❌ حاول مرة أخرى.";
    }
}
