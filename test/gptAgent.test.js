let chai;
let expect;
before(async function() {
  chai = await import('chai');
  expect = chai.expect;
});

const gptAgent = require('../gptAgent');

describe('convertToCooklang', function() {
    it('should convert recipe text to Cooklang format', async function() {
        const recipeText = 'Add 1 cup of milk to the bowl. Mix in 2 eggs. Bake at 350 degrees for 30 minutes.';
        const result = await gptAgent.convertToCooklang(recipeText);
        expect(result).to.be.a('string');
        // expect(result).to.equal('Add 1 cup of milk to the bowl. Mix in 2 eggs. Bake at 350 degrees for 30 minutes.'); --change this to the expected output
        
    });
});