import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, displayLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import Likes from './models/Likes';


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
            recipeView.displayRecipe(
                state.recipe,
                state.likes.isLiked(id));



           
        }catch (error){
            console.log(error);
            alert("Something went wrong with processing the recipe. Some recipes unfortunately do not load, this is a known bug. Please try another.");
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

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);

        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
})


////Like Controller

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {
        //add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle like button
        likesView.toggleLikeBtn(true);

        //add like to UI
        likesView.displayLike(newLike);
    } else {
        //remove like from state
        state.likes.deleteLike(currentID);
        //toggle like button
        likesView.toggleLikeBtn(false);


        //remove like from UI
        likesView.deleteLikeUI(currentID);

    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
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
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller

        controlLike();
    }
});

///page load events
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.displayLike(like));
})
