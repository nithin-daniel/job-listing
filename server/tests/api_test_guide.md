# API Testing Guide

## 1. User Registration (Signup)

```http
POST /api/signup/

{
    "user_type": "individual",
    "password": "test123",
    "is_worker": true,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "mobile_number": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "highest_qualification": "Bachelor's",
    "experience": 5,
    "service_category": 1,
    "hourly_rate": 25.00
}
```

## 2. User Login

```http
POST /api/login/

{
    "email": "john@example.com",
    "password": "test123"
}
```

## 3. Offers

### Get All Offers

```http
GET /api/offers/
GET /api/offers/?job_id=1
GET /api/offers/?worker_id=1
```

### Create Offer

```http
POST /api/offers/

{
    "job": 1,
    "worker": 1,
    "price": 500.00,
    "description": "I can complete this job in 2 days",
    "worker_accepted": true,
    "client_accepted": false,
    "is_completed": false
}
```

### Get Specific Offer

```http
GET /api/offers/1/
```

### Update Offer Status

```http
PATCH /api/offers/1/

# For Worker
{
    "user_id": 1,
    "worker_accepted": true,
    "is_completed": true
}

# For Client
{
    "user_id": 2,
    "client_accepted": true
}
```

## 4. Users

### Get All Users

```http
GET /api/users/
GET /api/users/?is_worker=true
GET /api/users/?city=New York
GET /api/users/?service_category=1
```

### Get Specific User

```http
GET /api/users/1/
```

## 5. Jobs

### Create Job (with images)

```http
POST /api/jobs/
Content-Type: multipart/form-data

{
    "title": "Need Plumbing Work",
    "description": "Fix leaking pipe in kitchen",
    "client": 1,
    "service_category": 1,
    "budget": 300.00,
    "location": "New York",
    "images": [file1.jpg, file2.jpg]
}
```

## Testing Tool Examples

### Using cURL

```bash
# Signup
curl -X POST http://localhost:8000/api/signup/ \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "test123", ...}'

# Login
curl -X POST http://localhost:8000/api/login/ \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "test123"}'

# Create Job with Images
curl -X POST http://localhost:8000/api/jobs/ \
    -H "Content-Type: multipart/form-data" \
    -F "title=Need Plumbing Work" \
    -F "description=Fix leaking pipe" \
    -F "images=@image1.jpg" \
    -F "images=@image2.jpg"
```

### Using Python requests

```python
import requests

# Signup
response = requests.post(
    'http://localhost:8000/api/signup/',
    json={
        "email": "test@example.com",
        "password": "test123",
        # ... other fields
    }
)

# Create Job with Images
files = [
    ('images', ('image1.jpg', open('image1.jpg', 'rb'))),
    ('images', ('image2.jpg', open('image2.jpg', 'rb')))
]
data = {
    'title': 'Need Plumbing Work',
    'description': 'Fix leaking pipe',
    # ... other fields
}
response = requests.post('http://localhost:8000/api/jobs/', files=files, data=data)
```
