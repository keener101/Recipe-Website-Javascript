import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }


    async getResults(){
        const key = 'a406a24d9e467edb01b26c7f7e6b9c1e';
        const proxy = 'https://cors-anywhere.herokuapp.com/'
        const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result = res.data.recipes;
    }   
}