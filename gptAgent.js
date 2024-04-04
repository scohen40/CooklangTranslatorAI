const openai = require('./openaiClient').openai;

/* should the metadata be seen and moved to the top? */
/* front matter: specs for putting metadata in markdown */
/* TODO: Do we want to deal with json text? */
async function convertToCooklang(recipeText) {
  const fewShotPrompt = `
  Instructions:  Convert the following recipe descriptions into CookLang markdown/format according to the CookLang specifications. 
  Maintain the original instructions sentence structure, grammar, syntax, capitalization, and punctuation, only converting the ingredients, cookware, and time words into CookLang markdown. 

Here are some important specifications: 

- If the original recipe is in github flavored markdown, aside from comments, convert it to plain text before converting it to CookLang markdown. 
- You can add comments to the end of a line with -- or add block comments in between [- and -]. 
- Ingredients are prefixed with @ and followed by {quantity%unit}. Only include a quanity and/or unit if it is present in the original recipe.
- Cookware is denoted with # and followed by {size}. Only include a size if it is present in the original recipe.
- Time is denoted with ~ and followed by the timer's name followed by {quantity%unit}. Only include a quanity and/or unit if it is present in the original recipe.  
- If the original recipe is not in list format, each instruction step should be on a new line. The end of an instruction step should be denoted by a period.
- If the original recipe is in a non-numbered list, numbered list, bullet point list, or mixed format, convert each list item into a CookLang markdown format. Remove the list prefix (number, -, bullet point, etc.) and place each list item on it's own line.
- Metadata is denoted with '>>key: value'. This would placed listed at the top of the recipe. Only include the metadata if it is present in the original recipe. Examples:
  >> source: https://www.gimmesomeoven.com/baked-potato/
  >> time required: 1.5 hours
  >> course: dinner
  >> servings: 2
- Maintain the original instruction steps sequence and sentence structure, only converting ingredients, quantities, time, and cookware to CookLang format.
- Cooking actions, descriptive phrases (for example 'scrambled'), should not be converted and should remain as plain text.
- If a list of ingredients is included before the instructions and the instructions reference the list, put the quantities in the respective instructions references so that the list and instructions are combined into one list or set of steps. If the instructions are unclear in referencing the ingredients, keep the ingredients list separate from the instructions and convert the ingredients list to CookLang format on their own
- Only @mention each ingredient and #mention each cookware once. After the first time, you can simply refer to the ingredient or cookware by name and relative quantity (e.g. “then put half the remaining bacon in the oven to crispen.”).
- Temperatures like "high heat", "medium heat", or "high heat" should not be converted and should remain as plain text.
- Try not to alter the original punctuation or sentence format unless absolutely necessary (such as a r). Don't change any commas into periods. Don't capitalize any letters that were lowercase and vice-versa. 
- If the recipe instructions do not clearly and specifically reference the individual ingredients, you have permission to edit the instructions just enough to add the specific, relevant ingredient references. Try to change the original instructions as little possible. 
- If the recipe is split into multiple sections of ingredients and instructions, convert each section and then combine all sections in the original order of the sections. 

Simple Examples for Conversion:
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

Longer Full Examples for Conversion:
Example A:
Original: "
source:	https://www.dinneratthezoo.com/wprm_print/6796
total time:	6 minutes
servings:	2
INGREDIENTS
1,5 cups apple juice
one sliced banana
1,5 cups frozen mixed berries
0.75 cup vanilla greek yogurt
some honey
COOKWARE
blender
Place the apple juice, banana, frozen mixed berries and vanilla greek yogurt in a blender; blend until smooth. If the smoothie seems too thick, add a little more liquid (1/4 cup).
Taste and add honey if desired. Pour into two glasses and garnish with fresh berries and mint sprigs if desired. "
CookLang: " 
>> source: https://www.dinneratthezoo.com/wprm_print/6796
>> total time: 6 minutes
>> servings: 2

Place the @apple juice{1,5%cups}, @banana{one sliced}, @frozen mixed berries{1,5%cups} and @vanilla greek yogurt{3/4%cup} in a #blender{}; blend until smooth. If the smoothie seems too thick, add a little more liquid (1/4 cup). 

Taste and add @honey{} if desired. Pour into two glasses and garnish with fresh berries and mint sprigs if desired. "

Example B:
Original: "
# Slow cooker white chicken chili

[Origin](http://www.food.com/recipe/crock-pot-white-chicken-chili-114789)

## Ingredients

 - 1 1⁄4 lbs boneless skinless chicken
 - 2 (15 ounce) cans great northern beans or 2 (15 ounce) cans navy beans
 - 1 (15 ounce) can hominy or 1 (15 ounce) can white corn
 - 1 (1 1/4 ounce) envelope taco seasoning
 - 1 (4 1/2 ounce) can of chopped green chilies
 - 1 (10 3/4 ounce) can condensed cream of chicken soup
 - 1 (14 ounce) can chicken broth

## Toppings

 - 1⁄2 cup sour cream
 - chopped green onion (optional)
 - monterey jack cheese (optional)

## Directions

1. Place chicken in a 4 quart slow cooker.
2. Top with beans and corn.
3. In a medium bowl, combine taco seasoning, chiles, condensed soup, and chicken broth. Pour over top of ingredients in the crock pot.
4. Cover and cook on low for 8 to 10 hours.
5. Before serving, stir gently to break up chicken, then stir in the sour cream.
6. Serve topped with green onions and jack cheese, if desired.

## Comments

We didn't get taco seasoning so I added some cumin, chili powder, pepper, salt, paprika, (coriander?) to get a similar effect. Used a can of yellow sweet corn that we had. We didn't get the cream of chicken soup so I made my own ([similar to this?](https://www.apinchofhealthy.com/homemade-condensed-cream-of-chicken-soup/)) by making a roux and adding some leftover cream/milk and some more of the chicken broth and letting that cook down a bit (similar to macaroni and cheese recipe.) Thought it turned out really good!
"
CookLang: "
>> title: Slow cooker white chicken chili
>> source: http://www.food.com/recipe/crock-pot-white-chicken-chili-114789)
Place @boneless skinless chicken{1,1/4%lb} in a #4 quart slow cooker{}.
Top with @beans{2%(15 ounce) cans great northern beans or (15 ounce) cans navy beans} and @corn{2%(15 ounce) cans hominy or (15 ounce) cans white corn}.
In a #medium bowl{}, combine @taco seasoning{1%(1 1/4 ounce) envelope}, @chiles{1%(4 1/2 ounce) can of chopped green chilies}, @condensed soup{1%(10 3/4 ounce) can condensed cream of chicken soup}, and @chicken broth{1%(14 ounce) can chicken broth}. Pour over top of ingredients in the crock pot.
Cover and cook on low for ~crock pot{8-10%hours}.
Before serving, stir gently to break up chicken, then stir in the @sour cream{1/2%cup}.
Serve topped with @chopped green onions{(optional)} and @montery jack cheese{(optional)}, if desired.
[- We didn't get taco seasoning so I added some cumin, chili powder, pepper, salt, paprika, (coriander?) to get a similar effect. Used a can of yellow sweet corn that we had. We didn't get the cream of chicken soup so I made my own ([similar to this?](https://www.apinchofhealthy.com/homemade-condensed-cream-of-chicken-soup/)) by making a roux and adding some leftover cream/milk and some more of the chicken broth and letting that cook down a bit (similar to macaroni and cheese recipe.) Thought it turned out really good! -]
"

Example C:
Original: "
Delicious Challah
4 cups warm H20 
2 yeast bars/4 dry packets or 3 tbs. dry yeast
1 tbs. sugar
Preheat oven to 300 degrees then turn off.
Set on oven door for 10 minutes.
5lb High Gluten Flour
2 cups sugar
1 1/2 tbs. salt
3 large eggs
1 1/2 cups canola oil
1 large egg (lightly beaten)

mix. brush top in oil
cover in towel
let rise 1 1/2 hrs in warm oven or in preheated 200 degree oven that is off. 
Brush on egg. let rise 95 min. 
350 degees/ 25-35 min. 
"
CookLang: "
>> title: Delicious Challah
Preheat #oven{} to 300 degrees then turn off.
Combine @warm water{4%cups}, @yeast{2 yeast bars or 4 dry packets} and @sugar{1%tbs.}. Set on oven door for ~{10%minutes}.
Mix together @High Gluten Flour{5%lb}, @sugar{2%cups}, @salt{1,1/2%tbs.}, @eggs{3 large} and @canola oil{1,1/2%cups}. Brush top in @oil{} and cover in towel.
Let rise ~{1,1/2%hrs} in warm oven or in preheated 200 degree oven that is off. 
Brush on @egg (lightly beaten){1 large}. Let rise ~{95%min}. 
350 degees/ ~{25-35%min}. 
"

Please convert the below recipe into CookLang format as per the specifications.
  Recipe: ${recipeText}
  Cooklang:
  `;
  // console.log(fewShotPrompt);
  const response = await prompt(fewShotPrompt);
    
  return response;
}
// Example D:
// Original: ""
// CookLang: ""

// Example E:
// Original: ""
// CookLang: ""
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
`;
const recipe4 = `
ChocochipCheezeCake 
3 8oz cream cheese
3 eggs
1 can condensed milk
2 caps full vanilla
1 cup chocochip divided
1/2 Tbspoon flour
24 Oreo cookies(smashed)

spread and press oreos in the flan pan
mix cream cheese real well then add milk
add eggs one at a time
add vanilla, add 1/2 cup chocochips and milk + slightly sift 1/2 cup chips in flour then spread on top

All MUST BE ROOM TEMP.
Bake at pre-heated oven 350 for 1:10 hrs or till inserted knife comes out clean


`;
//TODO --finish the above

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