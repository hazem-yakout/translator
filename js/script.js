const select = document.querySelectorAll("select");
const fromtext = document.querySelector(".from-text");
const totext = document.querySelector(".to-text");
const exchangeicon = document.querySelector(".exchange");
const btn = document.querySelector("button");
const icons = document.querySelectorAll(".row i");
select.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected =
            id == 0 ?
            country_code == "en-GB" ?
            "selected" :
            "" :
            country_code == "hi-IN" ?
            "selected" :
            "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});
exchangeicon.addEventListener("click", () => {
    let tempcode = fromtext.value,
        templang = select[0].value;
    fromtext.value = totext.value;
    select[0].value = select[1].value;
    totext.value = tempcode;
    select[1].value = templang;
});
fromtext.addEventListener("keyup", () => {
    if (!fromtext.value) {
        totext.value = "";
    }
});
btn.addEventListener("click", () => {
    let text = fromtext.value.trim(),
        translateFrom = select[0].value,
        translateTo = select[1].value;
    if (!text) return;
    totext.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            totext.value = data.responseData.translatedText;
            data.matches.forEach((data) => {
                if (data.id === 0) {
                    totext.value = data.translation;
                }
            });
            totext.setAttribute("placeholder", "Translation");
        });
});
icons.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromtext.value || !totext.value) return;
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromtext.value);
            } else {
                navigator.clipboard.writeText(totext.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromtext.value);
                utterance.lang = select[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(totext.value);
                utterance.lang = select[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});