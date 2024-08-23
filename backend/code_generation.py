# This file handles saving mocked data, generating, and cleaning up the code based on the task list
import json
import os

import globals
from globals import call_llm
from utils import (
    create_and_write_file,
    create_folder,
    delete_folder,
    folder_exists,
    read_file,
)

# HOW CODE GENERATION FOLDER WORKS
# - They will all rest in generated/generations_[timestamp]_[uuid]
# - They will all have a faked_data.json file

# - for lock step
# [code_folder_path]/index.html - main code that is changed and updated constantly
# [code_folder_path]/checked.html - after all the steps, the final checked code
# [code_folder_path]/cleaned.html - after all the steps, the final cleaned code
# [code_folder_path]/[task_id]/merged.html - initial generated code per task_id
# [code_folder_path]/[task_id]/checked.html - checked generated code per task_id - currently not being used
# [code_folder_path]/[task_id]/cleaned.html - cleaned generated code per task_id

# for one shot
# index.html - main code that is changed and updated constantly
# initial.html - initial code
# checked.html - checked code
# cleaned.html - cleaned code

openai_api_key = os.getenv("OPENAI_API_KEY")

get_faked_data_code = """
useEffect(() => {
        fetch('http://127.0.0.1:5000/get_faked_data')
          .then(response => response.json())
          .then(data => setRecipes(JSON.parse(data.faked_data)))
          .catch(error => console.error('Error fetching data:', error));
      }, []);
"""

sample_gojs_code = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Goal Tracking Mind Map</title>
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Load MUI from CDN -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <script src="https://unpkg.com/@mui/material@5.0.0-rc.1/umd/material-ui.development.js" crossorigin></script>
  <!-- Load GoJS for mind map visualization -->
  <script src="https://unpkg.com/gojs/release/go.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const {
      Box,
      Container,
      Typography,
      Drawer,
      Button,
      TextField,
      IconButton,
      Divider,
      List,
      ListItem,
      ListItemText,
      ListItemSecondaryAction,
      Dialog,
      DialogTitle,
      DialogContent,
      DialogActions,
    } = MaterialUI;

    const { useState, useEffect, useRef } = React;

    function App() {
      const [goals, setGoals] = useState([]);
      const [isDrawerOpen, setIsDrawerOpen] = useState(false);
      const [newGoal, setNewGoal] = useState({ title: '', description: '' });
      const [editingGoal, setEditingGoal] = useState(null);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const diagramRef = useRef(null);

      useEffect(() => {
        initMindMap([]);
      }, []);

      const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
      };

      const handleInputChange = (event) => {
        setNewGoal({ ...newGoal, [event.target.name]: event.target.value });
      };

      const handleAddGoal = () => {
        if (newGoal.title.trim()) {
          const newGoalData = { ...newGoal, id: Date.now().toString(), status: 'Not Started', subgoals: [] };
          const updatedGoals = [...goals, newGoalData];
          setGoals(updatedGoals);
          updateMindMap(updatedGoals);
          setNewGoal({ title: '', description: '' });
          toggleDrawer();
        }
      };

      const handleEditGoal = (goal) => {
        setEditingGoal(goal);
        setIsDialogOpen(true);
      };

      const handleUpdateGoal = () => {
        const updatedGoals = goals.map(g => (g.id === editingGoal.id ? editingGoal : g));
        setGoals(updatedGoals);
        updateMindMap(updatedGoals);
        setEditingGoal(null);
        setIsDialogOpen(false);
      };

      const handleDeleteGoal = (goalToDelete) => {
        const updatedGoals = goals.filter(g => g.id !== goalToDelete.id);
        setGoals(updatedGoals);
        updateMindMap(updatedGoals);
      };

      const initMindMap = (data) => {
        const $ = go.GraphObject.make;
        const diagram = $(go.Diagram, "mindMapDiv", {
          "undoManager.isEnabled": true,
          layout: $(go.TreeLayout, {
            angle: 90,
            layerSpacing: 35,
          }),
          initialContentAlignment: go.Spot.Center,
        });

        diagram.nodeTemplate =
          $(go.Node, 'Auto',
            new go.Binding('text', 'title'),
            $(go.Shape, 'RoundedRectangle', {
              fill: 'lightblue',
              stroke: null,
            }),
            $(go.TextBlock, {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true,
            }, new go.Binding('text', 'title'))
          );

        diagram.linkTemplate =
          $(go.Link,
            $(go.Shape, { strokeWidth: 2 }),
            $(go.Shape, { toArrow: 'Standard' })
          );

        diagram.model = new go.TreeModel(data);
        diagramRef.current = diagram;
      };

      const updateMindMap = (data) => {
        const diagram = diagramRef.current;
        diagram.model = new go.TreeModel(data);
      };

      return (
        <Container maxWidth="xl">
          <Box display="flex" height="100vh">
            <Box flex={3} position="relative">
              <Typography variant="h4" gutterBottom>
                Goal Tracking Mind Map
              </Typography>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  height: '80vh',
                }}
                id="mindMapDiv"
              >
              </Box>
            </Box>
            <Box flex={1}>
              <Typography variant="h5" gutterBottom>
                Goal Management
              </Typography>
              <Button variant="contained" onClick={toggleDrawer}>
                Add Goal
              </Button>
              <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
                <Box p={2} width={300}>
                  <Typography variant="h6" gutterBottom>
                    Add New Goal
                  </Typography>
                  <TextField
                    label="Title"
                    name="title"
                    value={newGoal.title}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={newGoal.description}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                  <Button variant="contained" onClick={handleAddGoal}>
                    Add Goal
                  </Button>
                </Box>
              </Drawer>
              <Divider />
              <List>
                {goals.map((goal) => (
                  <ListItem key={goal.id}>
                    <ListItemText primary={goal.title} secondary={goal.description} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEditGoal(goal)}>
                        <i className="material-icons">edit</i>
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteGoal(goal)}>
                        <i className="material-icons">delete</i>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                value={editingGoal?.title || ''}
                onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={editingGoal?.description || ''}
                onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateGoal}>Save</Button>
            </DialogActions>
          </Dialog>
        </Container>
      );
    }

    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  </script>
</body>
</html>
"""
sample_gpt_hook = f"""
try {{
  const response = await fetch('https://api.openai.com/v1/chat/completions', {{
    method: 'POST',
    headers: {{
      'Content-Type': 'application/json',
      'Authorization': `Bearer {openai_api_key}`
    }},
    body: JSON.stringify({{
      model: 'gpt-4',
      messages: [
        {{
          role: 'system',
          content: 'You are a helpful assistant providing clothing recommendations based on user preferences.'
        }},
        {{
          role: 'user',
          content: `
          Based on the following preferences, provide a list of recommended clothing items in the following JSON format:
          [
            {{
              "id": 6,
              "itemName": "Striped T-Shirt",
              "description": "A classic striped t-shirt made of 100% cotton.",
              "imageUrl": "https://example.com/striped-tshirt.jpg",
              "size": "M",
              "brand": "H&M",
              "price": 19.99
            }},
            ...
          ]

          Preferences: XYX

          Ensure the JSON is valid and adheres strictly to this format. Do not type any additional text, only provide the JSON.
          `
        }}
      ]
    }})
  }});

  const result = await response.json();
  const parsedData = JSON.parse(result.choices[0].message.content);
  setRecommendations(parsedData);
}} catch (err) {{
  setError(err.message);
}} finally {{
  setLoading(false);
}}
"""

sample_gpt_image_code = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clothing Recommender App</title>
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Load MUI from CDN -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <script src="https://unpkg.com/@mui/material@5.0.0-rc.1/umd/material-ui.development.js" crossorigin></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const {{
      Container,
      Typography,
      Grid,
      Card,
      CardContent,
      CardMedia,
      IconButton,
      Box,
      List,
      ListItem,
      ListItemText,
      FormControl,
      FormLabel,
      FormGroup,
      FormControlLabel,
      Checkbox,
      Button,
    }} = MaterialUI;

    const {{ useState, useEffect }} = React;

    function App() {{
      const [surveyData, setSurveyData] = useState([]);
      const [recommendations, setRecommendations] = useState([]);
      const [savedItems, setSavedItems] = useState([]);
      const [selectedOptions, setSelectedOptions] = useState({{}});
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      useEffect(() => {{
        fetch('http://127.0.0.1:5000/get_faked_data')
          .then(response => response.json())
          .then(data => {{
            const parsedData = JSON.parse(data.faked_data);
            setSurveyData(parsedData.filter(item => item.surveyQuestion));
            setRecommendations(parsedData.filter(item => !item.surveyQuestion));
          }})
          .catch(error => console.error('Error fetching data:', error));
      }}, []);

      const handleSaveItem = (item) => {{
        setSavedItems([...savedItems, item]);
      }};

      const handleRemoveItem = (item) => {{
        setSavedItems(savedItems.filter(savedItem => savedItem.id !== item.id));
      }};

      const handleOptionChange = (event, surveyId) => {{
        setSelectedOptions({{
          ...selectedOptions,
          [surveyId]: event.target.checked
            ? [...(selectedOptions[surveyId] || []), event.target.value]
            : selectedOptions[surveyId].filter(option => option !== event.target.value),
        }});
      }};

      const handleSearch = async () => {{
        setLoading(true);
        setError(null);

        const selectedOptionsArray = Object.entries(selectedOptions).flatMap(([surveyId, options]) =>
          options.map(option => `${{surveyData.find(survey => survey.id === parseInt(surveyId)).surveyQuestion}}: ${{option}}`)
        );

        const searchPrompt = selectedOptionsArray.join('\\n');

        try {{
          const response = await fetch('https://api.openai.com/v1/chat/completions', {{
            method: 'POST',
            headers: {{
              'Content-Type': 'application/json',
              'Authorization': `Bearer {openai_api_key}`
            }},
            body: JSON.stringify({{
              model: 'gpt-4',
              messages: [
                {{
                  role: 'system',
                  content: 'You are a helpful assistant providing clothing recommendations based on user preferences.'
                }},
                {{
                  role: 'user',
                  content: `
                  Based on the following preferences, provide a list of recommended clothing items in the following JSON format:
                  [
                    {{
                      "id": 6,
                      "itemName": "Striped T-Shirt",
                      "description": "A classic striped t-shirt made of 100% cotton.",
                      "size": "M",
                      "brand": "H&M",
                      "price": 19.99
                    }},
                    ...
                  ]

                  Preferences:
                  ${{searchPrompt}}

                  Ensure the JSON is valid and adheres strictly to this format. Do not type any additional text, only provide the JSON.
                  `
                }}
              ]
            }})
          }});

          const result = await response.json();
          const parsedData = JSON.parse(result.choices[0].message.content);

          // Fetch images for each recommendation
          for (let i = 0; i < parsedData.length; i++) {{
            const item = parsedData[i];
            const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {{
              method: 'POST',
              headers: {{
                'Content-Type': 'application/json',
                'Authorization': `Bearer {openai_api_key}`
              }},
              body: JSON.stringify({{
                prompt: `An image of a ${{item.description}}, brand ${{item.brand}}, size ${{item.size}}.`,
                n: 1,
                size: "128x128"
              }})
            }});

            const imageResult = await imageResponse.json();
            item.imageUrl = imageResult.data[0].url;  // Assuming the image URL is returned here
            console.log(item.imageUrl);
          }}

          setRecommendations(parsedData);
        }} catch (err) {{
          setError(err.message);
        }} finally {{
          setLoading(false);
        }}
      }};

      return (
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            Clothing Recommender App
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Survey
                  </Typography>
                  {{surveyData.map(survey => (
                    <FormControl component="fieldset" key={{survey.id}}>
                      <FormLabel component="legend">{{survey.surveyQuestion}}</FormLabel>
                      <FormGroup>
                        {{survey.options.map(option => (
                          <FormControlLabel
                            key={{option}}
                            control={{
                              <Checkbox
                                checked={{selectedOptions[survey.id]?.includes(option) || false}}
                                onChange={{(event) => handleOptionChange(event, survey.id)}}
                                value={{option}}
                              />
                            }}
                            label={{option}}
                          />
                        ))}}
                      </FormGroup>
                    </FormControl>
                  ))}}
                  <Button variant="contained" color="primary" onClick={{handleSearch}}disabled={{loading}}>
                    {{loading ? 'Loading...' : 'Search'}}
                  </Button>
                  {{error && <Typography color="error">{{error}}</Typography>}}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Recommendations
                  </Typography>
                  <Grid container spacing={2}>
                    {{recommendations.map(item => (
                      <Grid item xs={12} sm={6} md={4} key={{item.id}}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="140"
                            image={{item.imageUrl}}
                            alt={{item.itemName}}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h6" component="h3">
                              {{item.itemName}}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              {{item.description}}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              Size: {{item.size}}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              Brand: {{item.brand}}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              Price: ${{item.price}}
                            </Typography>
                            <Box mt={2}>
                              <IconButton
                                aria-label="Save Item"
                                onClick={{() => handleSaveItem(item)}}
                              >
                                <i className="material-icons">favorite_border</i>
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Saved Items
              </Typography>
              <List>
                {{savedItems.map(item => (
                  <ListItem key={{item.id}}>
                    <ListItemText
                      primary={{item.itemName}}
                      secondary={{`${{item.brand}} - $${{item.price}}`}}
                    />
                    <IconButton
                      aria-label="Remove Item"
                      onClick={{() => handleRemoveItem(item)}}
                    >
                      <i className="material-icons">remove_circle_outline</i>
                    </IconButton>
                  </ListItem>
                ))}}
            </CardContent>
          </Card>
        </Container>
      );
    }}

    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>
"""

sample_code = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App with MUI and Hooks</title>
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Load MUI from CDN -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <script src="https://unpkg.com/@mui/material@5.0.0-rc.1/umd/material-ui.development.js" crossorigin></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const {
      Button,
      Container,
      Typography,
      TextField,
    } = MaterialUI;

    const { useState, useEffect } = React;

    function App() {
      const [count, setCount] = useState(0);
      const [name, setName] = useState('');

      useEffect(() => {
        document.title = \`Count: \${count}\`;
      }, [count]);

      return (
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Hello, React with Material-UI and Hooks!
          </Typography>
          <Typography variant="h5">
            Count: {count}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setCount(count + 1)}>
            Increment
          </Button>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <Typography variant="h6">
            Name: {name}
          </Typography>
        </Container>
      );
    }

    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  </script>
</body>
</html>
"""

code_rules= f"""
Make sure to implement all that is specified in the task and do not leave anything else. Follow these rules when writing code:
1. The entire app will be in one index.html file. It will be written entirely in HTML, Javascript, and CSS. The design should not incorporate routes. Everything should exist within one page. No need for design mockups, wireframes, or external dependencies.
2. The entire app will be written using React and MUI. Load MUI from the CDN. Here is an example: {sample_code}
3. DO NOT DELETE PREVIOUS CODE. DO NOT RETURN A CODE SNIPPET. RETURN THE ENTIRE CODE. Only ADD to existing code to implement the task properly. DO NOT COMMENT PARTS OF THE CODE OUT AND WRITE /*...rest of the code */ or something similar.
4. Grab existing data to help build the application through an endpoint like so: {get_faked_data_code}. USE THIS ENDPOINT TO GRAB THE DATA.
5. If the app requires it, it can call OpenAI for additional data or API calls like so: {sample_gpt_hook}. If the app requires images, it can also call GPT to grab images like in this example: {sample_gpt_image_code}
6. If the app requires some visualization element like a pie chart or a bar chart, you can load chart.js from the CDN like so: : <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>.
Ensure that when creating a chart, we do not run into the error where the `useEffect` hook in the `PieChart` or whatever chart component we are creating component is a new instance of the `Chart` object every time the component re-renders, without destroying the previous instance. To fix this, we need to store a reference to the chart instance and destroy it before creating a new one.
7. If the app requires visualization such as  a flow chart, mind map, or tree, you can use GoJS from the CDN like so:  {sample_gojs_code}
8. If the app would be better with animation, use three.js from the CDN like so:   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
9. DO NOT LOAD ANYTHING ELSE IN THE CDN. Specifically, DO NOT USE: MaterialUI Icon, Material UI Lab.
10. Do not return separate code files. All the components should be in one code file and returned.
11. Do not type import statements. Assume that MUI and react are already imported libraries, so to use the components simply do so like this: const \{{Button, Container, Typography, TextField \}} = MaterialUI; or const \{{ useState, useEffect \}} = React;
"""

code_rules_base = f"""
 - The entire app will be in one index.html file. It will be written entirely in HTML, Javascript, and CSS. The design should not incorporate routes. Everything should exist within one page. No need for design mockups, wireframes, or external dependencies.
 - The entire app will be written using React and MUI. Load MUI from the CDN. Here is an example: {sample_code}
 - DO NOT DELETE PREVIOUS CODE. DO NOT RETURN A CODE SNIPPET. RETURN THE ENTIRE CODE. Only ADD to existing code to implement the task properly. DO NOT COMMENT PARTS OF THE CODE OUT AND WRITE /*...rest of the code */ or something similar.
 - If the app would be better with animation, use three.js from the CDN like so:   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
 - DO NOT LOAD ANYTHING ELSE IN THE CDN. Specifically, DO NOT USE: MaterialUI Icon, Material UI Lab.
 - Do not return separate code files. All the components should be in one code file and returned.
 - Do not type import statements. Assume that MUI and react are already imported libraries, so to use the components simply do so like this: const \{{Button, Container, Typography, TextField \}} = MaterialUI; or const \{{ useState, useEffect \}} = React;
 
 """

code_rules_gpt = f"""
  - If the app requires it, it can call OpenAI for additional data or API calls like so: {sample_gpt_hook}. If the app requires images, it can also call GPT to grab images like in this example: {sample_gpt_image_code}
  
"""

code_rules_chart = f"""
  - If the app requires some visualization element like a pie chart or a bar chart, you can load chart.js from the CDN like so: : <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>.
  
  """

code_rules_visualization = f"""
  - If the app requires visualization such as  a flow chart, mind map, or tree, you can use GoJS from the CDN like so:  {sample_gojs_code}

  """

code_rules_fake_data = f"""
  - Grab existing data to help build the application through an endpoint like so: {get_faked_data_code}. USE THIS ENDPOINT TO GRAB THE DATA.

  """

def get_code_rules(tools_requirements=None):
	
  # if tools_requirements is None, return the base code rules
  if tools_requirements is None:
      return code_rules
  
  rules = code_rules_base
  if "gpt" in tools_requirements:
      rules += code_rules_gpt
  if "chart" in tools_requirements:
      rules += code_rules_chart
  if "visualization" in tools_requirements:
      rules += code_rules_visualization
  if "fake_data" in tools_requirements:
      rules += code_rules_fake_data
  return rules


def get_fake_data(design_hypothesis, user_input):
	print("calling LLM for get_fake_data...")
	system_message = """
        You are generating fake JSON data for a UI that a user wants to create. The design hypothesis should give instructures as to what data needs to be generated.

        For example, for this design hypothesis:
        "Application Layout:

        - Create a clean, minimalist interface with a prominent central area for displaying outfit recommendations.
        - Divide the interface into three main sections: "Outfit Recommendations," "Wardrobe," and "Saved Outfits."
        - The "Outfit Recommendations" section should display swipeable cards with visual representations of the recommended outfits, along with relevant tags (season, occasion, style).
        - The "Wardrobe" section should allow users to input their clothing items, categorized by type (tops, bottoms, dresses, etc.).
        - The "Saved Outfits" section should display a grid of liked outfits for future reference.

        User Interactions:

        - Users can swipe left by clicking no, or right by clicking yes on the outfit recommendation cards to dislike or like the outfit, respectively.
        - Users can click on individual clothing items in the "Wardrobe" section to add or remove them from their virtual wardrobe.
        - Users can click on a liked outfit in the "Saved Outfits" section to view its details or remove it from the saved list.

        Inputs and Logic:

        - The app will use the user's initial wardrobe inputs and style preferences (gathered through a brief questionnaire) to kickstart the GPT-powered outfit recommendation algorithm.
        - The algorithm will consider factors like season, occasion, and the user's wardrobe items to generate outfit recommendations.
        - The user's interactions (likes, dislikes) with the recommended outfits will be used as feedback to refine and personalize the algorithm's recommendations over time.
        - The liked outfits will be saved in the "Saved Outfits" section for future reference.
        - Create placeholder data for initial wardrobe."
  we only want to generate fake data for the INITIAL wardrobe, not the outfit recommendations.

	Please generate a JSON array of fake data with appropriate fields. THE USER INPUT WILL INCLUDE THE DATA FIELDS. PLEASE INCLUDE ALL FIELDS THE USER INPUT SUGGEST. Here is an example:

        Input: I want to create a UI that visualizes a beauty store's inventory... It should have the fields `title`, `description`, `price`, `discountPercentage`, `rating`, `stock`, `brand`, `category`

        System result:
        [
            {
                "id": 11,
                "title": "perfume Oil",
                "description": "Mega Discount, Impression of A...",
                "price": 13,
                "discountPercentage": 8.4,
                "rating": 4.26,
                "stock": 65,
                "brand": "Impression of Acqua Di Gio",
                "category": "fragrances",
            },
            {
                "id": 12,
                "title": "perfume Oil",
                "description": "Half Off",
                "price": 15,
                "discountPercentage": 12.3,
                "rating": 3.46,
                "stock": 2343,
                "brand": "Victoria Secret",
                "category": "fragrances",
            },
        ]
        Please follow these rules while creating the JSON array
        1. Please only return the JSON array and nothing else.
        2. Array length should be length 10-20.
        3. Please ensure that the generated data makes sense.
    """
	user_message = f"please generate data given this UI: {design_hypothesis}. Factor in this user suggestion into generating the data: {user_input}"
	res = call_llm(system_message, user_message)
	print("sucessfully called LLM for get_fake_data", res)
	return res

# this code generated is one shot
# NOT NECESSARY
def implement_plan(prompt, plan, design_hypothesis, code_folder_path, faked_data):
	print("calling LLM for implement_plan...")
	cleaned_code_file_path = f"{code_folder_path}/{globals.CLEANED_CODE_FILE_NAME}"
	initial_code_file_path = f"{code_folder_path}/initial.html"
	main_code_file_path = f"{code_folder_path}/{globals.MERGED_CODE_FILE_NAME}"
	get_ui_code(prompt, plan, design_hypothesis, initial_code_file_path, main_code_file_path, faked_data)
	# overall_check(design_hypothesis, checked_code_file_path, main_code_file_path)
	cleanup_code(cleaned_code_file_path, main_code_file_path)
	return main_code_file_path

def get_ui_code(plan, task, design_hypothesis, previous_task_main_code_file_path, task_merged_code_file_path, faked_data):
	print("calling LLM for get_ui_code...")
	previous_code = read_file(previous_task_main_code_file_path)
	user_message = f"Please execute this task: {task}"
	system_message = f"""
                You are working on an app described here: {design_hypothesis}.
                The entire app will be written in React and MUI within an index.html file. There is only this index.html file for the entire app.
				We've broken down the development of it into these tasks: {plan}.
				Currently, you are working on this task: {task}.
				For context, this is the faked_data: {faked_data}
				There is already existing code in the index.html file. Using the existing code {previous_code}.
				{code_rules}
"""
	code = call_llm(system_message, user_message)
	create_and_write_file(task_merged_code_file_path, code)
	merged_code_lines = len(code.splitlines())
	previous_code_lines=len(previous_code.splitlines())
	if previous_code_lines-50 > merged_code_lines:
		print("trying again... writing code failed...")
		get_ui_code(plan, task, design_hypothesis, previous_task_main_code_file_path, task_merged_code_file_path, faked_data)
	print("sucessfully called LLM for get_ui_code", code)
	return code

def implement_plan_lock_step(design_hypothesis, plan, code_folder_path, task_id, faked_data):
	print("calling LLM for implement_plan_lock_step...")
	if len(plan) == 0 or plan is None:
		print("ERROR: there was no plan...")
		return ""
	step = plan[task_id-1]
	print("executing for step " + step["task"])
	task_code_folder_path = f"{code_folder_path}/{step["task_id"]}"
	create_folder(task_code_folder_path)
	task_cleaned_code_file_path = f"{task_code_folder_path}/{globals.CLEANED_CODE_FILE_NAME}"
	task_merged_code_file_path = f"{task_code_folder_path}/{globals.MERGED_CODE_FILE_NAME}"
	task_main_code_file_path = f"{task_code_folder_path}/{globals.MAIN_CODE_FILE_NAME}"
	if task_id==1:
		implement_first_task(design_hypothesis, step["task"], task_merged_code_file_path, faked_data)
		cleanup_code(task_cleaned_code_file_path, task_merged_code_file_path, task_main_code_file_path)
		return task_cleaned_code_file_path
	# task_code_file_path = f"{task_code_folder_path}/{globals.TASK_FILE_NAME}"
	previous_task_main_code_file_path = f"{code_folder_path}/{step["task_id"]-1}/{globals.MAIN_CODE_FILE_NAME}"
    # uncomment below for GPT
	# identify_code_changes(plan, step["task"], task_code_file_path, previous_task_main_code_file_path, design_hypothesis)
	# inject_code(step["task"], previous_task_main_code_file_path, task_merged_code_file_path, task_code_file_path)
	# below is for Claude
	get_ui_code(plan, step["task"], design_hypothesis, previous_task_main_code_file_path, task_merged_code_file_path, faked_data)
	cleanup_code(task_cleaned_code_file_path, task_merged_code_file_path, task_main_code_file_path)
	print("finished executing lock step for task_id", {task_id})

def implement_first_task(design_hypothesis, task, task_merged_code_file_path, faked_data):
	print("calling LLM for implement_first_task...")
	user_message = f"Please execute this task: {task}."
	system_message = f"""
                You are writing HTML, Javascript, and CSS code for creating a UI given a data model. For context, this is the goal: {design_hypothesis}. Here is the faked data for context: {faked_data}.
				We will grab the faked_data from the endpoint, if it exists. Grab it like so: {get_faked_data_code}.
				{code_rules}
            """
	code = call_llm(system_message, user_message)
	print("called LLM for initial html file code", code)
	user_message = f"This is the existing code {code}"
	system_message = f"""
				Make sure the React and MUI code is wrapped within an index.html structure. MAKE SURE THAT THE INDEX.HTML IS WRAPPED LIKE THIS:
				<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App with MUI and Hooks</title>
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Load MUI from CDN -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <script src="https://unpkg.com/@mui/material@5.0.0-rc.1/umd/material-ui.development.js" crossorigin></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // REACT AND MUI CODE
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  </script>
</body>
</html>
				Do not return separate React and MUI components. Compile it all together in one file (index.html) and in one component and only send me the code.
				Follow this as a sample structure: {sample_code}
            """
	code_with_data = call_llm(system_message, user_message)
	print("called LLM for initial html file code")
	code_with_data = code_with_data
	create_and_write_file(task_merged_code_file_path, code_with_data)
	print("sucessfully called LLM for implement_first_task", code_with_data)

# not used
def inject_code(task, previous_task_main_code_file_path, task_merged_code_file_path, task_code_file_path):
    print("calling LLM for inject_code...")
    task_code = read_file(task_code_file_path)
    previous_code = read_file(previous_task_main_code_file_path) if previous_task_main_code_file_path else ""
    user_message = f"Please merge these code snippets that execute this task {task}: {task_code}"
    system_message = f"""
                You are a code merging system that is merging code snippets into existing code.
				The user will provide an array that shows a line number where you should inject the code snippet.
				This is the previous state of the code: {previous_code}.
				Loop through the list and logically inject the code into the previous code around the given line number so that it compiles properly, while still retaining previous logic.
				Replace code if the task requires you to replace a specific line of code.
				For example, if there is already a search bar and the task asks to implement search functionality, do not create a new search bar. Replace the current search bar with the new search bar. Or, if you are to add a column to a table, you should REPLACE the existing table - do not create a new table.
				Otherwise, you must KEEP all previous code - you should not modify any of the previous code. Simply inject the code snippet to the line number.
				DO NOT write comments similar to /* existing code goes here*/, or /* existing styles here... */, /* existing data items here... */, or anything similar.
				KEEP all the data. Do NOT truncate data items, or comment out data items in the array. KEEP ALL DATA ITEMS.
				Keep all the previous code in one file.
				The code should be in this format with no natural language: {sample_code}
            """
    res = call_llm(system_message, user_message)
    merged_code = f"This is the merged code: \n {res}"
    create_and_write_file(task_merged_code_file_path, merged_code)
    merged_code_lines = len(merged_code.splitlines())
    previous_code_lines=len(previous_code.splitlines())
    if previous_code_lines > merged_code_lines:
        print("injecting code again... merge failed...")
        inject_code(task, previous_task_main_code_file_path, task_merged_code_file_path, task_code_file_path)
    print("successfully called LLM for merge_code...")

def get_iterate_code(problem, task, task_code_folder_path, current_iteration_folder_path, design_hypothesis, faked_data):
    print("calling LLM for get_iterate_code...")
    task_main_code_file_path = f"{task_code_folder_path}/{globals.MAIN_CODE_FILE_NAME}"
    task_debug_merge_file_path = f"{current_iteration_folder_path}/{globals.ITERATION_MERGE_FILE_NAME}"
    task_debug_cleaned_code_file_path = f"{current_iteration_folder_path}/{globals.ITERATION_CLEANED_FILE_NAME}"
    task_code = read_file(task_main_code_file_path)
    user_message = f"Please fix the problem that the user describes: {problem}, please fix the problem in the existing code and return the entire code! Thank you!"
    system_message = f"""
                A coding task has been implemented for a project we are working on.
				For context, this is the project description: {design_hypothesis}. The task was this: {task}. This is the faked_data: {faked_data}
				However, the task was not implemented fully correctly. The user explains what is wrong in the problem {problem}.
				There is already existing code in the index.html file. Using the existing code {task_code}. Please fix the problem.
				{code_rules}
				PLEASE DO NOT DELETE EXISTING CODE.
                Return the FULL CODE NEEDED TO HAVE THE APP WORK, INSIDE THE INDEX.HTML file.
            """
    iterated_code = call_llm(system_message, user_message)
    create_and_write_file(task_debug_merge_file_path, iterated_code)
	# Uncomment for GPT
    # inject_code(problem, task_cleaned_code_file_path, task_debug_merge_file_path, task_debug_code_file_path)
    cleanup_code(task_debug_cleaned_code_file_path, task_debug_merge_file_path, task_main_code_file_path)
    print("successfully called LLM for get_iterate_code...", iterated_code)
    return task_main_code_file_path


def test_code_per_lock_step(task, design_hypothesis):
    print("calling LLM for test_code_per_lock_step...")
    user_message=f"Provide test cases for the user to test that this task {task} was successfully implemented."
    system_message = f"""
                You are helping a user test their code given a certain task. The user will test their code on the UI. Assume the  UI is already open on the web browser. Provide 1-3 examples of how the user should test their UI to check that the task works.
				For context, the overall application has this design: {design_hypothesis}.
				However, you are focused on testing the TASK specified. The task you are helping the user check is this: {task}.
                There is no need to test responsiveness of HTML regarding browser size.
				Return the response in an array with this format: [test1, test2], where test1 and test2 are strings describing how to test the code.
				
				For example, if the design hypothesis was: "The UI will be designed as a table, resembling Gmail, featuring columns like 'Item name', 'Quantity', 'Expiration Date', and 'Category'. Users can add, delete and update items. Clicking a row will open a detailed view of the item, including its nutritional information. A search bar, at the top, allows users to quickly find specific items.",
				and the task was: "Create a form with fields corresponding to the table columns to add new items", an example response could be: ["Clicking the 'Add Now' button should have a form pop up to add items", "Entering items into the form should add it to the table"]
            """
    cases = call_llm(system_message, user_message)
    print("sucessfully called LLM for test_code_per_lock_step", cases)
    return cases

def cleanup_code(cleaned_code_file_path, code_file_path, task_main_code_file_path):
	print("calling LLM for cleanup_code...")
	code = read_file(code_file_path)
	user_message = f'This is the code: \n {code}'
	system_message=f"""
                You are cleaning up React and MUI code to ensure that it runs on first try.
				If the code runs on first try, return the code. DO NOT RETURN ANYTHING ELSE, DO NOT RETURN SOMETHING LIKE "This code is already cleaned."
				DO NOT DELETE ANY CODE. Only remove natural language. The goal is to have the code compile. Comments are okay.
				This is an EXAMPLE of a result: {sample_code}.
				MAKE SURE THAT THE CODE IS WRAPPED LIKE THIS:
				<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App with MUI and Hooks</title>
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Load MUI from CDN -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <script src="https://unpkg.com/@mui/material@5.0.0-rc.1/umd/material-ui.development.js" crossorigin></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // REACT AND MUI CODE
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  </script>
</body>
</html>
            """
	cleaned_code = call_llm(system_message, user_message)
	create_and_write_file(cleaned_code_file_path, cleaned_code)
	# every time we clean code it's the end of the step and we probably want to update the index.html file
	create_and_write_file(task_main_code_file_path, cleaned_code)
	print("successfully called LLM for cleanup_code: " + cleaned_code)

def wipeout_code(code_folder_path, task_id, task_map, theory):
	print(f"wiping out code from task id {task_id}")
	num_steps = len(task_map)
	for i in range(task_id, num_steps+1):
		task_code_folder_path = f"{code_folder_path}/{i}"
		if not folder_exists(task_code_folder_path):
			break
		delete_folder(task_code_folder_path)
		task_code_iteration_folder_path = f"{code_folder_path}/{i}/{globals.ITERATION_FOLDER_NAME}"
		delete_folder(task_code_iteration_folder_path)
		task_map[i][globals.CURRENT_DEBUG_ITERATION] = 0
		task_map[i][globals.DEBUG_ITERATION_MAP] = {}
	if task_map:
		create_and_write_file(f"{globals.folder_path}/{theory}/{globals.TASK_MAP_FILE_NAME}", json.dumps(task_map))
	print(f"successfully wiped out code from task id {task_id}")
