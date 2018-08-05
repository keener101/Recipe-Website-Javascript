import Search from './models/Search';

/*Global State of app
    -Search Object
    -Current Recipe Object
    -Shopping List Object
    -Liked Recipes

*/

const state = {};

const controlSearch = async () => {
    //1 Get Query from view
    const query = 'creamed spinach'; //todo

    if(query){
        //2 new search obj, add to state
        state.search = new Search(query);
        
        //3 prepare UI for results

        //4 search for recipes 
        await state.search.getResults();

        //5 display results on UI
        console.log(state.search.result);
    }
} 

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})