# Custom health mobile app

- Language: Typescript
- Frontend: React Native
- Database: Postgresql, https://github.com/ammarahm-ed/react-native-mmkv-storage on the client side
- Backend
  - API: REST with ExpressJS
  - Authentication: Magic links with JSON Web Tokens
- Deployment: Docker, Azure (see if we can get a free cloud instance)

- Frontend + Backend monorepo ideas
  - Literally just 2 separate folders in the same git repository
    - Not very practical since the frontend and backend would need to share api code
  - Workspace with separate frontend, backend packages
    - https://docs.expo.dev/guides/monorepos/
    - https://blog.cvoice.io/how-to-setup-a-react-native-monorepo
    - https://bun.sh/docs/install/workspaces

# App features

- Track macros (calories, protein, etc) by inserting food items by:
  - Creating custom food items
  - Searching existing foods from the USDA api and other food databases
- Track weight by inserting the daily weight and visualizing using a graph
  - Graph view can toggle between zoomed in daily view, full view and view from weekly averages
- Track exercise
  - Track interval training and resistance training
  - Mini hiit timer when selecting a interval exercise

# User data

- Weight values -- floats mapped to a date
- List of foods that's refreshed daily.
  - Each food containing
    - info (name, calories, protein, carbs, etc)
    - quantity eaten
  - Custom food items
- Target macros
  - Calorie limit
- List of exercises. Each exercise is either
  - type: interval -- work duration, rest duration, # of rounds
  - type: resistance -- reps, sets, weight
- Preferences and auth data
