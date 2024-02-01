require('dotenv').config();

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function convertToCooklang(recipeText) {
  const fewShotPrompt = `Instructions:  Convert the following recipe descriptions into CookLang format according to the CookLang specifications. 
  Maintain the original sentence structure, grammar, syntax, capitalization, and punctuation, only converting the ingredients, cookware, and time words into CookLang markdown. 

Here are some important specifications: 

- Ingredients are prefixed with @ and followed by {} for quantity and unit.
- Cookware is denoted with # and followed by {}.
- Maintain the original sentence structure, only converting ingredients, quantities, and cookware to CookLang format.
- Cooking actions, descriptive phrases (for example 'scrambled'), should not be converted and should remain as plain text.
- Temperatures like "high heat", "medium heat", or "high heat" should not be converted and should remain as plain text.
- Do not alter the original punctuation, sentence format, or add any newline characters.
- Don't change any {} you don't change any commas into periods.
- Don't capitalize any letters that were lowercase.

DO NOT DEVIATE FROM THE INSTRUCTIONS OR TAKE LIBERTIES WITH WORDING, GRAMMAR, OR PUNCTUATION.

Examples for Conversion:
Example 1:
Original: "Mix 2 cups of flour and 1 cup of sugar. Add 3 eggs and a teaspoon of vanilla extract."
CookLang: "Mix @flour{2 cups} and @sugar{1 cup}. Add @egg{3} and @vanilla extract{1%tsp}."

Example 2:
Original: "Boil 500ml of water and add 100g of pasta. Cook for 10 minutes."
CookLang: "Boil @water{500%ml} and add @pasta{100%g}. Cook for ~{10%minutes}."

Example 3:
Original: "Chop one onion and fry in olive oil until golden. Add diced tomatoes and cook for 5 minutes."
CookLang: "Chop @onion{1} and fry in @olive oil{} until golden. Add @diced tomatos{} and cook for ~{5%minutes}."

Example 4:
Original: Take a copper pan, bang it on the counter, and then fill it with one cup of water.
Cooklang: Take a #copper pan{}, bang it on the counter, and then fill it with @water{1%cup}.

Example 5:
Original: Put one tablespoon of salt into a large bowl.
Cooklang: Put @sale{1%tbsp} into a #bowl{large}.



Please convert the below recipe into CookLang format as per the specifications.
  Recipe: ${recipeText}
  Cooklang:
  `;
  // console.log(fewShotPrompt);
  const response = await prompt(fewShotPrompt);
    
  return response;
}

const recipe = "Boil 100g of spaghetti and add tomato sauce.";
const recipe2 = "Crack 4 eggs into a bowl, whisk, and then add 200ml of milk and a pinch of salt. Cook on a low heat until scrambled.";
// TODO: Add more test cases like the following and more less than idealy formatted recipes. 
const recipe3 = `
# Baked Chicken Alfredo 

## [Sauce](https://therecipecritic.com/2016/02/the-best-homemade-alfredo-sauce-ever/)

 - ½ cup butter
 - 1 pint heavy whipping cream (2 cups)
 - 4 ounces cream cheese
 - ½ teaspoon minced garlic
 - 1 teaspoon garlic powder
 - 1 teaspoon italian seasoning
 - ¼ teaspoon salt
 - ¼ teaspoon pepper
 - 1 cup grated parmesan cheese

 - In a medium saucepan add butter, heavy whipping cream, and cream cheese. Cook over medium heat and whisk until melted.  
 - Add the minced garlic, garlic powder, italian seasoning, salt and pepper. Continue to whisk until smooth. Add the grated parmesan cheese.
 - Bring to a simmer and continue to cook for about 3-5 minutes or until it starts to thicken.

# The bake

Then mix with cooked pasta and cooked chicken (rotisserie?) with cheese on top and put in oven on 350 degrees F until cheese on top is melted.

Some red pepper flakes or black pepper is nice for a bit more spice.
`
//"Crack @egg{4} into a #bowl{}, #whisk{}, and then add @milk{200%ml} and a pinch of @salt{}. Cook on a low heat until scrambled."
convertToCooklang(recipe3);

async function prompt(fewShotPrompt, temperature=0, max_tokens=500, presence_penalty=0) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use the latest available model
      messages: [{role: 'system', content: fewShotPrompt}],
      temperature: temperature,
      max_tokens: max_tokens,
      presence_penalty: presence_penalty
    });
    console.log(response.choices[0].message.content);
    if (response && response.choices) {
      const reply = response.choices[0].message.content;
      console.log('----');
      console.log("Cooklang Formatted Recipe:", reply)
      return reply;
    }
    else {
      console.log("No choices available in the response.");
    }
  } catch (error) {
    console.error("Error in calling OpenAI API:", error);
    return null;
  }
}

exports.convertToCooklang = convertToCooklang;