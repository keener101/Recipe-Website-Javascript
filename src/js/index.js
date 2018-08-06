import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, displayLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView';

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

        //create recipe obj
        state.recipe = new Recipe(id);

        try{

             //get recipe data
            await state.recipe.getRecipe();

            //calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //display recipe in UI
            console.log(state.recipe);

        }catch (error){
            console.log(error);
            alert("Something went wrong with processing the recipe");
        }

       

    };

}

window.addEventListener('hashchange', controlRecipe);