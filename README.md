
# DynEx: Structured Design Exploration for AI Code Synthesis
<img src="teaser.png" alt="teaser"/>
This repository accompanies our research paper: [DynEx: Dynamic Code Synthesis and Structured Design Exploration For Accelerated Exploratory Programming](https://arxiv.org/abs/2410.00400). It contains the code to our core dimensions for Design Matrix exploration, as well as our modular code generation pipeline. Below are the steps to set up DynEx on your local machine. <br/>

# Set Up <br />
You must run both the FE and BE for this repository. <br />

## Front End <br />
In one terminal... <br/> <br/>
### Set up <br/>
Make sure npm, react, and mui are installed<br />

### To run FE <br />
`cd frontend`<br />
`npm start`<br />

## BackEnd <br />
In another terminal... <br/>

### Set up <br/>
1. `cd backend` <br/>
2. `conda env create -n dynex -f environment.yml`<br />
3. pip install more dependencies if necessary <br /> 
4. create a `.env` file within the backend directory <br/> and add your Open AI API key and Anthropic API Key. They should be saved as follows: `"ANTHROPIC_API_KEY"="xyz"`, and `"OPENAI_API_KEY"="xyz"` <br/>
5. create a `generated` folder within backend directory - this is where all the generated code will stay
<br/> <br/>
### To run BE <br/>
`conda activate dynex`<br />
`python server.py` <br />
