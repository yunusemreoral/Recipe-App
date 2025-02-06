// Uuid benzersiz id'ler oluşturan bir kütüphanedir.Bu projede tarif malzemeleri için benzersiz id'ler oluşturmak istediğimizden bu kütüphaeyi kullandık.

import { v4 } from "https://jspm.dev/uuid";
import  Search  from "./api.js";
import { 
    controlBtn, 
    elements, 
    getFromLocalStorage, 
    setToLocalStorage } from "./helpers.js";
import { Recipe } from "./recipe.js";
import { renderBasketItems, renderLoader, renderResults } from "./ui.js";


// localstorage daki sepet verilerini al ve bir diziye aktar

let basket = getFromLocalStorage("basket") || [];

// recipe clasının örneğini al
const recipe = new Recipe();

// fonskiyonlar

// form gönderilmesinde çalışacak fonksiyon
const handleSubmit = async (e) => {
    // formun gönderilmesinde oluşan default sayfa yenileme  özelliğini iptal et
    e.preventDefault();

    // ınput içerisindeki değere erişme
    const query = e.target[0].value;
    
    if (!query) {
    Toastify({
        text: "Arama boş bırakılamaz!",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #FF9D23, #F93827)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();

      return;
         // Eğer query yoksa uyarı ver ve kodu durdur
    }

    // eger query yoksa apı işlemlerini yap

    // apı.js dosyasında oluşturulan classın örneğini al

    const search = new Search(query);

    renderLoader(elements.resultList);
    try{
        // Search classı içerisindeki getResults fonksiyonunu çalıştır ve verileri al
        await search.getResults();
 // Gelen verileri ui.js deki  renderResults ile ekrana render et
        renderResults(search.result);
    } catch (err) {
        // Bir hata olursa bunu yakala ve uyarı ver
        alert("Aradığınız kriterde tarif bulunamadı");
    }
// Input içerisini sıfırla
    e.target[0].value = "";
};

// sayfa yüklendiğinde ve id değişince çalışacak fonskyion

const controlRecipe = async () => {
    // Ui dosyasında url e geçilen # ile id'yi api'a gönderirsek hata alırız.Bunun önlemek için replace("#", "") ile # kaldırdık.
    const id = window.location.hash.replace("#", "");

    if (id) {
        // recipeArea alanına loader render et
        renderLoader(elements.recipeArea);
        try {
            // recipeArea alanına loader render et
            await recipe.getRecipe(id);

            recipe.renderRecipe(recipe.info);
        } catch (err) {}
    }
};

// recipeArea ya tıklanıldıgında çalışacak fonskyion
const handleClick = (e) => {
    // sepet iconuna tıklanırsa
    if (e.target.id === "add-to-basket") {
        // sepete ekle butonuna tıklanınca herbir tarif elemanı için bir obje oluşturacağız
        recipe.ingredients.forEach((title) => {
            // herbir malzeme için bir obje oluştur
            const newItem = {
                id: v4(),
                title,
            };
            // herbir ürünü sepet dizisine ekle
            basket.push(newItem);
        });
        // sepete i localstorage a gönder
        setToLocalStorage("basket", basket);

        // sepetteki ürünleri render et
        renderBasketItems(basket);

        // sepetteki ürün miktarına göre clearBtn i render et
        controlBtn(basket);
    }
    // like butonuna tıklanırsa
    if (e.target.id === "like-btn") {
        recipe.controlLike();
    }
};

// sepetteki ürünü silen fonksiyon
const deleteItem = (e) => {
    if (e.target.id === "delete-item") {
        // tıklanılan elemanın kapsam elemanına eriş
        const parentElement = e.target.parentElement;
        // parenelemanın id sine eriş
        const parentId = parentElement.dataset.id;
        // sepetteki ürünlerin arasında id sini bilinen elemanı sepetten kaldır
        basket = basket.filter((i) => i.id != parentId);

        // sepetin güncel halini localstorage a gönder
        setToLocalStorage("basket", basket);

        // elemanı arayüzden de kaldır
        parentElement.remove();

        // sepetteki ürün miktarına göre clearBtn i render et
        controlBtn(basket);
    }
};

// sepetti sıfırlayan fonksiyon

const handleClear = () => {
    // kullanıdan silmek istediğinize eminmisiniz şeklinde bir onay al
    const res = confirm("Bütün sepet silinecek!! Eminmisiniz ??");

    if (res) {
        //localstorage i temizle
        setToLocalStorage("basket", null);

        // basket dizisini sıfırla
        basket = [];

        // sepet alanın html ini boşat
        elements.basketList.innerHTML = "";

        // sepetteki ürün miktarına göre clearBtn i render et
        controlBtn(basket);
    }
};

// ! olay izlecileri
// formun gönderilmesini izle

elements.form.addEventListener("submit", handleSubmit); 

// Url'deki değişimi ve sayfa yüklenmesini izle
["load", "hashchange"].forEach((eventName) => {
    window.addEventListener(eventName, controlRecipe);
    //sayfa yüklendiğinde sepetteki verileri render et
    renderBasketItems(basket);
    // sepetteki ürün miktarına göre clearBtn i render et
    controlBtn(basket);
});

// recipe alanındaki tıklamaları izle
elements.recipeArea.addEventListener("click", handleClick);

// sepetteki ürünleri tıklanılma olayını izle
elements.basketList.addEventListener("click", deleteItem);

// clearbtn e tıklanma olayıını izle
elements.clearBtn.addEventListener("click", handleClear);