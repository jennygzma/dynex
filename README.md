# Front End <br />
In one terminal... <br/> <br/>
### Set up <br/>
Make sure npm, react, and mui are installed<br />

### To run FE <br />
`cd frontend`<br />
`npm start`<br />

# BackEnd <br />
In another terminal... <br/>

### Set up <br/>
`cd backend` <br/>
`conda env create -n UIDesignProto -f environment.yml`<br /> <br/>
pip install as necessary<br />
create a `.env` file within the backend directory <br/> and add your Open AI API key and Anthropic API Key. They should be saved as follows: `"ANTHROPIC_API_KEY"="xyz"`, and `"OPENAI_API_KEY"="xyz"` <br/>
create a `generated` folder within backend directory - this is where all the generated code will stay
<br/> <br/>
### To run BE <br/>
`conda activate UIDesignProto`<br />
`python server.py` <br />

