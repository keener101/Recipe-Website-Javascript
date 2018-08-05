import Search from './models/Search';
import { elements, displayLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView';

/*Global State of app
    -Search Object
    -Current Recipe Object
    -Shopping List Object
    -Liked Recipes

*/

const state = {};

const controlSearch = async () => {
    //1 Get Query from view
    const query = searchView.getInput();

    if(query){
        //2 new search obj, add to state
        state.search = new Search(query);
        
        //3 prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        displayLoader(elements.searchRes);

        //4 search for recipes 
        await state.search.getResults();

        //5 display results on UI
        clearLoader();
        searchView.displayResults(state.search.result);
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

    
   
})