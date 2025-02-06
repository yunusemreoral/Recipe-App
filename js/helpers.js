export const elements = {
    form: document.querySelector("form"),
    resultList: document.querySelector(".results"),
    recipeArea: document.querySelector(".recipe"),
    basketList: document.querySelector(".shopping ul"),
    clearBtn: document.querySelector("#clear"),
    likeList: document.querySelector(".list"),
};

// localstroage a kayıt yapacak fonksiyon

export const setToLocalStorage = (key, data) => {
    // dışarıdan alınan datayı stringe çevir
    const strData = JSON.stringify(data);

    // stringe çevrilen elemanı localstora a kayıt et
    localStorage.setItem(key, strData);
};

export const getFromLocalStorage = (key) => {
    // belirtilen key değerine sahip elemanları localstroageden al

    const strData = localStorage.getItem(key);

    // localstorageden gelen veriyi js nesnesine çevir
    const data = JSON.parse(strData);

    return data;
};

export const controlBtn = (basket) => {
    // sepette ürün varsa clearBtn i göster
    if (basket.length > 0) {
        elements.clearBtn.style.display = "block";
    } else {
        // sepette ürün yoksa clearBtn i gösterme
        elements.clearBtn.style.display = "none";
    }
};
