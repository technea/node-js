const { randomSuperhero } = require('superheroes');
const { randomSupervillain } = require('supervillains');

const myHero = randomSuperhero();
const myVillain = randomSupervillain();

console.log('Random Superhero:', myHero);
console.log('Random Supervillain:', myVillain);