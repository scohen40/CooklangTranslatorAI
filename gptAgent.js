require('dotenv').config();

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function convertToCooklang(recipeText) {
  const fewShotPrompt = `Convert the following recipe instructions to Cooklang format:
  
  Recipe: Fry two eggs in a pan.
  Cooklang: @egg{2} #pan
  
  Recipe: ${recipeText}
  Cooklang:`;
  console.log(fewShotPrompt);
    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct", // Use the latest available model
        prompt: fewShotPrompt,
        max_tokens: 150
      });
  
      if (response && response.choices) {
        const reply = response.choices[0].text.trim();
        console.log('----');
        console.log("Cooklang Formatted Recipe:", reply)
        return response.choices[0].text.trim();
      }
      else {
        console.log("No choices available in the response.");
      }
    } catch (error) {
      console.error("Error in calling OpenAI API:", error);
      return null;
    }
  }

const recipe = "Boil 100g of spaghetti and add tomato sauce.";
convertToCooklang(recipe);
  