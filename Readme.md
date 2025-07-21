- Install Ollama
  Step 1: Install Ollama from link: https://ollama.com/download
  Step 2: Check version : -> ollama --version
  Step 3: First time loading model : -> ollama pull mistral:7b-instruct
  Step 4: Run the model: -> ollama run mistral:7b-instruct
  if you have Ollama in local : -> ollama run mistral:7b-instruct

- Run Back-end
  Step 1: enter BE : -> cd BE
  Step 2: run venv :
  if linux : source venv/bin/activate
  if window CMD : venv\Scripts\activate.bat
  if window PowerShell : venv\Scripts\Activate.ps1
  Step 3: create venv
  -> If venv file exists then delete it : rm -rf venv
  -> create venv : python3 -m venv venv
  -> run venv as Step 2
  -> install package from requirement : python3 -m pip install -r requirements.txt
  -> install python multipart : pip install python-multipart
  -> run uvicorn : uvicorn main:app --host 127.0.0.1 --port 8000 --workers 1

- Run Front-end
  Step 1: enter FE : -> cd FE:
  Step 2: install node module -> npm i
  Step 3: npm run dev
