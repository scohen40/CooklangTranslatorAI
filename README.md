# RecipeToCooklangGPTAgent
A GPT task prosecution agent for converting plain recipe text into Cooklang markdown.


## Feature/Project Goals
- [x] Few-Shot prompt to convert plain recipe text into Cooklang markdown utilizing OpenAI's GPT-3 for natural language processing.
- [ ] Complete OpenAI Agent formatting.
- [ ] Input JSON: Format for sending request to the Agent
- [ ] Output JSON: What to expect back from the Agent
- [ ] /explain Route: End-point for API documentation
- [ ] Package/Format according to OpenAI's requirements to deploy to the OpenAI plugin store.
- [ ] Unit Testing to verify conversion results.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js installed on your machine.
- An API key from OpenAI.

## Setup
To set up the Cooklang Recipe Converter, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/scohen40/RecipeToCooklangGPTAgent.git

2. Navigate to the project directory:
   ```bash
   cd CooklangTranslatorAI

3. Install the required npm packages:
   ```bash
   npm install

4. Create a `.env` file in the root directory and add your OpenAI API key:
   ```plaintext
    OPENAI_API_KEY=your_api_key_here

## License
This project uses the following license: [MIT License](LICENCE.md).



