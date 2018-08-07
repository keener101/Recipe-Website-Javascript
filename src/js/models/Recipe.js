import axios from 'axios';
import {key, proxy} from '../config'

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error){
            console.log(error);
            alert('Something went wrong!');
        }
    }

    calcTime() {

        //fake estimate, based on 15 mins per 3 ingredients.

        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'ozs', 'teaspoon', 'teaspoons', 'tsps', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'oz', 'tsp', 'tsp', 'tsp', 'cup', 'pound'];
        
        const newIngredients = this.ingredients.map(el =>{
            //uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((units, i) => {
                ingredient = ingredient.replace(units, unitsShort[i]);
            });

            //remove parentheses and text within parentheses

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients into count, unit and ingredient.
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));
            
           
            let objIng;
            

            if (unitIndex !== -1){
                //there is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice([unitIndex + 1]).join(" ")
                };

            }else if (parseInt(arrIng[0], 10)){
                //no unit, but number at start
                objIng = {
                    count : parseInt(arrIng[0],10),
                    unit : '',
                    ingredient : arrIng.slice(1).join(' ')
                };

            }else if (unitIndex === -1){
                //neither
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient 
                };

            };



            

            return objIng;
        })

        this.ingredients = newIngredients;
    }

    updateServings (type){


        const newServings = type === 'dec' ? this.servings -1 : this.servings +1;

        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}