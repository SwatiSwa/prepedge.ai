# FastAPI Application

## Overview
This is a simple FastAPI application that provides a basic API endpoint.

## Prerequisites
Ensure you have Python installed (Python 3.7+ recommended).

## Setup

### 1. Create a Virtual Environment (Optional but Recommended)
```sh
python -m venv .venv
source .venv/bin/activate  # On macOS/Linux
.venv\Scripts\activate  # On Windows
```

### 2. Install Dependencies
```sh
pip install fastapi uvicorn
```

### 3. Create a `requirements.txt` file
```sh
pip freeze > requirements.txt
```

### 4. Running the Application
Use the following command to start the FastAPI server:
```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Access the API
- Open your browser and go to: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- API Documentation (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc Documentation: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 6. Additional Endpoints
To expand the API, modify `main.py` and add new routes.

Example:
```python
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "query": q}
```

Then access: [http://127.0.0.1:8000/items/1?q=example](http://127.0.0.1:8000/items/1?q=example)

## Deployment
For production, run Uvicorn without `--reload`:
```sh
uvicorn main:app --host 0.0.0.0 --port 8000
```

## License
This project is licensed under the MIT License.
