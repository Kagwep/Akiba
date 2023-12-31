REPO="https://github.com/Kagwep/Akiba.git" 

# Branch name
BRANCH="main"


# Clone repo
git clone  $REPO 
cd  Akiba/

if [ -d "web_frontend" ]; then

  # Change directory
  cd web_frontend
  
  # Install npm packages
  npm install

  # Run dev server
  npm run dev
  
else
  echo "web-frontend folder not found"
  exit 1
fi
