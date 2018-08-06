import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, displayLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';


/*Global State of app
    -Search Object
    -Current Recipe Object
    -Shopping List Object
    -Liked Recipes

*/


const state = {};

//search controller

const controlSearch = async () => {
    //1 Get Query from view
    const query = searchView.getInput();

    if(query){
        //2 new search obj, add to state
        state.search = new Search(query);
        try{
            //3 prepare UI for results
            searchView.clearInput();
            searchView.clearResults();
            displayLoader(elements.searchRes);

            //4 search for recipes 
            await state.search.getResults();

            //5 display results on UI
            clearLoader();
            searchView.displayResults(state.search.result);

        }catch(error){
            console.log(error);
            clearLoader();
        }
    }
} 

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); 
        searchView.clearResults();
        searchView.displayResults(state.search.result, goToPage);  
    }

    
   
});

//recipe controller

const controlRecipe = async () => {
    //get id from url
    
    const id = window.location.hash.replace('#', '');
    console.log(id);

    //TESTING

    window.r = state.recipe;


    
    if (id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        displayLoader(elements.recipe);

        //create recipe obj
        if (state.search){
            searchView.highlightSelected(id);
        }
        state.recipe = new Recipe(id);

        try{

             //get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //display recipe in UI
            clearLoader();
            console.log(state.recipe.ingredients);
            recipeView.displayRecipe(state.recipe);



           
        }catch (error){
            console.log(error);
            alert("Something went wrong with processing the recipe");
        }

       

    };

}

window.addEventListener('hashchange', controlRecipe);


//List controller

const controlList = () => {

    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.displayItem(item);
    })

}






//event listener on button clicks
elements.recipe.addEventListener('click', e => {


    if (e.target.matches('.btn.decrease, .btn-decrease *')){
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsDisplay(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsDisplay(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }

});

window.l = new List();