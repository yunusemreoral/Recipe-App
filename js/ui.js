import { elements } from "./helpers.js";

// apıden gelen veri neticesinde arayüze tarif render eden fonskyion
export const renderResults = (recipes) => {
    //  elements.resultList içerisini boşalt (Çünkü öncesinde bu alanda loader render ediyoruz)
    elements.resultList.innerHTML = "";
    // Gelen verilerin sayısını ayarla
    recipes.slice(0, 10).forEach((recipe) => {
        // Verilere göre recipe arayüzü oluştur
        // her bir eleman içinde yer alan ıd i url ye geçtik
        const markup = `<a href="#${recipe.recipe_id}" class="result-link">
                    <img src="${recipe.image_url}"
                    alt="result-img"/>

                    <div class="data">
                        <h4>${recipe.title}</h4>
                        <p>${recipe.publisher}</p>                  
                    </div>
                </a>`;
// Oluşturulan  bu arayüzü Html kısımına paketle
                elements.resultList.insertAdjacentHTML
                ("beforeend", markup);
    });
   
};

// loader render eden fonksiyon

export const renderLoader = (parent) => {
    // Bir loader elemanı oluştur
    const loader = `
    <div class="loader">
    <img src="/assets/food-load.gif"/>
    </div>
    `;

    // oluşturulan bu loaderı parent içerisine aktar

    parent.insertAdjacentHTML("afterbegin", loader);
};

// sepetteki herbir ürün için bir sepet elemanı render eden fonksiyon

export const renderBasketItems = (items) => {
    const markup = items
    .map(
        (item) => `
        <li data-id="${item.id}">
     <i class="bi bi-x" id="delete-item"></i>
     <span>${item.title}</span>
   </li>`
)
.join("");

elements.basketList.innerHTML = markup;
};