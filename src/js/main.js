/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
// cATEGORIES start
async function getcategories() {
    try{
       let response=await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
       let data=await response.json();
       // console.log(data.categories);
       displaycategories(data.categories);
    }catch(error){console.log("error  getting categoriess");
    };
}
function getCategoryIcon(categoryName) {
    const iconsMap = {
        "Beef": "fa-drumstick-bite",
        "Chicken": "fa-kiwi-bird",
        "Dessert": "fa-cake-candles",
        "Lamb": "fa-bone",
        "Seafood": "fa-fish",
        "Pasta": "fa-bowl-food",
        "Vegetarian": "fa-carrot",
        "Breakfast": "fa-egg",
        "Goat": "fa-mountain"
       
    };
    return iconsMap[categoryName] || "fa-utensils";
}

function displaycategories(categories){
    const categorygrid =document.getElementById('categories-grid');
    categorygrid.innerHTML="";
    categories.forEach(element => {
        const iconClass = getCategoryIcon(element.strCategory);
        let categoriesele =`
           <div
              class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
              data-category="${element.strCategory}"
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                   <i class="fa-solid ${iconClass}"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${element.strCategory}</h3>
                </div>
              </div>
            </div>
        `
        categorygrid.innerHTML += categoriesele;
    });
}
getcategories();
/// categories end

///meals start
async function getmeals() {
   try{
     let response =await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
    let data= await response.json();
    console.log(data.meals);
    displaymeals(data.meals);
   }catch (error) {
        console.log("error in getmeals:", error.message);
   }
}

function displaymeals(meals)
{
    const mealsgrid=document.getElementById('recipes-grid');
    mealsgrid.innerHTML="";
    meals.forEach(meal=>{
    let mealele=`
            <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${meal.idMeal}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${meal.strMealThumb}"
                  alt="${meal.strMeal}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${meal.strCategory}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${meal.strArea}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${meal.strMeal}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  Delicious recipe to try!
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${meal.strCategory}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${meal.strArea}
                  </span>
                </div>
              </div>
            </div>
    `
    mealsgrid.innerHTML +=mealele;
    document.getElementById('app-loading-overlay').classList.add('hidden')
    })
}
getmeals();
/// meals end

// search start
const searchinput=document.getElementById('search-input');
searchinput.addEventListener("input",async function(e) {
    let mealcategory=e.target.value.trim();
    try{
        let response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealcategory}`);
        let data=await response.json();
        if(data.meals)
        {
            displaymeals(data.meals);
        }else{document.getElementById('recipes-grid').innerHTML = `<p class="text-center col-span-full text-gray-500 py-8">No recipes found matching your search.</p>`;}
    }catch{console.log("eror in search input");}
})
// search  end

// filter srart
 const categorygrid =document.getElementById('categories-grid');
 categorygrid.addEventListener("click",async function (e) {
    const categorycard =e.target.closest('.category-card');
    if(!categorycard) return ;
    const categoryname =categorycard.getAttribute('data-category');
    if(!categoryname) return;
    try{
        let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryname}`);
        let data=await response.json();
        if(data.meals) displaymeals(data.meals);
    }catch{console.log("eror in filtering");
    }
 })
// filter end

//mealdetail start
const recipegrid=document.getElementById('recipes-grid');
recipegrid.addEventListener("click",async function (e) {
    const recipecard=e.target.closest('.recipe-card');
    if(!recipecard) return;
    const recipeid=recipecard.getAttribute('data-meal-id');
    if(!recipeid) return;
    try{
        let response=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeid}`);
        let data=await response.json();
        displaymealdata(data.meals[0])
        hidehome(true);
    }catch{console.log("eror in meal detail");}
    document.addEventListener('click',function(e){
      if(e.target.closest('#back-to-meals-btn')){hidehome(false);}
    })
})

function hidehome(showDetails)
{
  const searchsec=document.getElementById('search-filters-section');
  const mealsec=document.getElementById('meal-categories-section');
  const allrecipesec=document.getElementById('all-recipes-section');
  const recipesec=document.getElementById('recipes-grid');
  const detailsec=document.getElementById('meal-details');
  [searchsec, mealsec, recipesec,allrecipesec].forEach(el => {
        if (el) {
            if (showDetails) {
                el.classList.add('hidden'); 
            } else {
                el.classList.remove('hidden'); 
            }
        }
    });

  
    if (detailsec) {
        if (showDetails) {
            detailsec.classList.remove('hidden');
        } else {
            detailsec.classList.add('hidden');
        }
    }
}

function displaymealdata(meal) {
    const mealdata = document.getElementById('meal-details');
    if (!mealdata) return;

    // 1. تجميع المكونات والكميات ديناميك من الـ API
    let ingredientsHTML = '';
    let itemCount = 0;

    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            itemCount++;
            ingredientsHTML += `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                  <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                  <span class="text-gray-700">
                    <span class="font-medium text-gray-900">${measure ? measure : ''}</span> ${ingredient}
                  </span>
                </div>
            `;
        }
    }

    // 2. تقسيم خطوات التحضير (Instructions) لخطوات مرتبة لو متبوعة بنقاط أو أسطر
    let instructionsArray = meal.strInstructions 
        ? meal.strInstructions.split(/\r?\n/).filter(step => step.trim() !== "") 
        : [];

    let instructionsHTML = instructionsArray.map((step, index) => `
        <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            ${index + 1}
          </div>
          <p class="text-gray-700 leading-relaxed pt-2">
            ${step}
          </p>
        </div>
    `).join('');

    // 3. بناء هيكل الـ HTML بالكامل متوافق مع تصميمك الأصلي
    mealdata.innerHTML = `
        <div class="max-w-7xl mx-auto">
          <!-- Back Button -->
          <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Recipes</span>
          </button>

          <!-- Hero Section -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="relative h-80 md:h-96">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.strCategory || 'General'}</span>
                  <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.strArea || 'World'}</span>
                  <span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">Recipe</span>
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${meal.strMeal}</h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">4 servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">485 cal/serving</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mb-8">
            <button id="log-meal-btn" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all" data-meal-id="${meal.idMeal}">
              <i class="fa-solid fa-clipboard-list"></i>
              <span>Log This Meal</span>
            </button>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Ingredients & Instructions -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Ingredients -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto">${itemCount} items</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${ingredientsHTML}
                </div>
              </div>

              <!-- Instructions -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                  ${instructionsHTML}
                </div>
              </div>

              <!-- Video Section -->
              ${meal.strYoutube ? `
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>` : ''}
            </div>

            <!-- Right Column - Nutrition -->
            <div class="space-y-6">
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  <p class="text-sm text-gray-500 mb-4">Per serving</p>
                  <div class="text-center py-4 mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">485</p>
                    <p class="text-xs text-gray-500 mt-1">Total: 1940 cal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;
}
//mealdetail endd

// navigation start
function navigation(pagename)
{
  const searchsec=document.getElementById('search-filters-section');
  const mealsec=document.getElementById('meal-categories-section');
  const allrecipesec=document.getElementById('all-recipes-section');
  const recipesec=document.getElementById('recipes-grid');
  const productpage=document.getElementById('products-section');
  const logpage=document.getElementById('foodlog-section');
  
  if(pagename == 'meals')
  {
    productpage.classList.add('hidden');
    logpage.classList.add('hidden');
     searchsec.classList.remove('hidden');
    mealsec.classList.remove('hidden');
    allrecipesec.classList.remove('hidden');
    recipesec.classList.remove('hidden');
  }
  else if(pagename == 'products')
  {
    searchsec.classList.add('hidden');
    mealsec.classList.add('hidden');
    allrecipesec.classList.add('hidden');
    recipesec.classList.add('hidden');
    logpage.classList.add('hidden');
    productpage.classList.remove('hidden');
  }
  else if(pagename == 'log')
  {
     searchsec.classList.add('hidden');
    mealsec.classList.add('hidden');
    allrecipesec.classList.add('hidden');
    recipesec.classList.add('hidden');
    logpage.classList.remove('hidden');
    productpage.classList.add('hidden'); 
  }
}
document.addEventListener('click',function(e){
  const sidebutt=e.target.closest('[data-page]');
  e.preventDefault();
  const target=sidebutt.getAttribute('data-page');
  navigation(target);
})

/// navigation end