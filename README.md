# Sell Smart

An ecommerce platform customisable for any type of products

## Prerequisites

Make sure you have the following installed:

- Python
- pip (Python package installer)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Create a Virtual Environment

```bash
# On Windows
python -m venv venv

# On macOS and Linux
python3 -m venv venv
 ```

### 3. Activate the Virtual Environment
```bash
# On Windows
venv\Scripts\activate

# On macOS and Linux
source venv/bin/activate
```

### 4. Install Dependencies
```bash
# Install requirements file
pip install -r requirements.txt
```

### 5. Run migrations
```bash
# Make migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate
```

### 5. Run the Django Server
```bash
python manage.py runserver
```

