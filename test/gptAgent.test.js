let chai;
let expect;
before(async function() {
  chai = await import('chai');
  expect = chai.expect;
});

const gptAgent = require('../gptAgent');

describe('convertToCooklang', function() {
    it('1. should output a string', async function() {
        const recipeText = 'Add 1 cup of milk to the bowl. Mix in 2 eggs. Bake at 350 degrees for 30 minutes.';
        const result = await gptAgent.convertToCooklang(recipeText);
        expect(result).to.be.a('string');
        
    });

    it('1. should convert the plain recip', async function() {
        const recipeText = 'Add 1 cup of milk to the bowl. Mix in 2 eggs. Bake at 350 degrees for 30 minutes.';
        const result = await gptAgent.convertToCooklang(recipeText);
        expect(result).to.be.a('string');
        // expect(result).to.equal('Add 1 cup of milk to the bowl. Mix in 2 eggs. Bake at 350 degrees for 30 minutes.'); --change this to the expected output
        
    });

    it('3.should include all of the ingredients from the recipe in output string cooklang markdown', async function() {
        const recipeText = 'Add 1 cup of milk to the bowl. Mix in 2 eggs. Bake at 350 degrees for 30 minutes.';
        const result = await gptAgent.convertToCooklang(recipeText);
        expect(result).to.include('@milk{1 cup}');
        expect(result).to.include('@eggs{2}');
        expect(result).to.include('~{30 minutes}');
    });

    //TODO: write more tests like #3. the big thing is to get realistic data with many corner and edge cases to make sure the elements (food, utensils, measurements) aren't duplicated or missing with very unstructured data. don't worry about saving the original format/plain text. 

    //don't need to write a test like this which is basically 'does the markdown library work'
    // it('4.should include all of the ingredients from the recipe in output string cooklang json', async function() {
    //     // const recipeText = 'Add 1 cup of milk to the bowl. Mix in 2 eggs. Bake at 350 degrees for 30 minutes.';
    //     // const result = await gptAgent.convertToCooklang(recipeText);
    //     // expect(result).to.include('@milk{1 cup}');
    //     // expect(result).to.include('@eggs{2}');
    //     // expect(result).to.include('~{30 minutes}');
    // });
});


