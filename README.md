# 💼 JobFinder

A full-stack job board web application built with Django. Connects job seekers with companies — seekers can browse and apply for jobs, while company admins can post and manage listings.

<img width="1767" height="828" alt="image" src="https://github.com/user-attachments/assets/44729662-1dea-4a5c-ab60-69f7bcd8f5c8" />
<img width="1127" height="800" alt="image" src="https://github.com/user-attachments/assets/f0184d17-7010-4b82-a612-29587c1d9109" />





---

## Features

### For Job Seekers
- Browse all open job listings
- Search and filter by title, location, experience level, and minimum salary
- Apply to jobs with one click
- Track all submitted applications in one place
- View full job details including description, salary, and required experience

### For Company Admins
- Post new job listings with full details
- Edit or delete existing postings
- View application counts per job
- Dashboard showing total, open, and closed jobs

### General
- User registration with two account types: Job Seeker and Company Admin
- Secure login / logout with Django's authentication system
- Role-based navigation and access control
- Responsive UI with a shared base layout

---

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Backend   | Python 3, Django 6.0           |
| Database  | SQLite (development)           |
| Frontend  | HTML, CSS, Vanilla JS          |
| Auth      | Django custom `AbstractUser`   |

---

## Project Structure

```
mysite/
├── mysite/                  # Project settings, root URLs, WSGI/ASGI
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── jobs/                    # Main application
│   ├── models.py            # User, Job, Application models
│   ├── urls.py              # All URL routes
│   ├── views/
│   │   ├── auth_views.py    # Login, signup, logout
│   │   ├── job_views.py     # Job list and job details
│   │   ├── job_crud_views.py# Add, edit, delete, apply, my jobs
│   │   ├── search_views.py  # Search and filter logic
│   │   └── views.py         # Home page
│   ├── templates/           # HTML templates
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── jobs.html
│   │   ├── job-details.html
│   │   ├── add-job.html
│   │   ├── edit-job.html
│   │   ├── confirm-delete.html
│   │   ├── applied.html
│   │   ├── my-jobs.html
│   │   ├── search.html
│   │   ├── login.html
│   │   └── signup.html
│   └── static/              # CSS, images, icons
└── manage.py
```

---

## Data Models

### `User` (extends `AbstractUser`)
| Field             | Type        | Description                        |
|-------------------|-------------|------------------------------------|
| `is_company_admin`| Boolean     | True if the user is a company admin|
| `company_name`    | CharField   | Name of the company (admin only)   |

### `Job`
| Field                | Type          | Description                     |
|----------------------|---------------|---------------------------------|
| `title`              | CharField     | Job title                       |
| `description`        | TextField     | Full job description            |
| `salary`             | DecimalField  | Monthly/annual salary           |
| `years_of_experience`| IntegerField  | Minimum years required          |
| `company_name`       | CharField     | Posting company                 |
| `status`             | CharField     | `open` or `closed`              |
| `created_by`         | FK → User     | Company admin who posted the job|

### `Application`
| Field       | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| `user`      | FK → User | Job seeker who applied                |
| `job`       | FK → Job  | Job that was applied for              |
| `applied_at`| DateTime  | Timestamp of application              |

A `unique_together` constraint on `(user, job)` prevents duplicate applications.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd mysite
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Apply migrations

```bash
python manage.py migrate
```

### 5. Create a superuser (optional, for Django admin panel)

```bash
python manage.py createsuperuser
```

### 6. Run the development server

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` to open the app.

---

## URL Routes

| Method | URL                        | View                  | Description                     |
|--------|----------------------------|-----------------------|---------------------------------|
| GET    | `/`                        | `home`                | Home page with featured jobs    |
| GET    | `/jobs/`                   | `job_list`            | All open jobs (with filters)    |
| GET    | `/jobs/<id>/`              | `job_details`         | Single job detail page          |
| GET/POST| `/jobs/add/`              | `add_job`             | Post a new job (admins only)    |
| GET/POST| `/jobs/<id>/edit/`        | `edit_job`            | Edit a job (owner only)         |
| GET/POST| `/jobs/<id>/delete/`      | `delete_job`          | Delete a job (owner only)       |
| POST   | `/jobs/<id>/apply/`        | `apply_job`           | Apply for a job (seekers only)  |
| GET    | `/applied/`                | `applied_jobs`        | View applied jobs (seekers)     |
| GET    | `/my-jobs/`                | `my_jobs`             | Manage posted jobs (admins)     |
| GET    | `/search/`                 | `search`              | Search/filter form              |
| GET/POST| `/login/`                 | `login_view`          | Login page                      |
| GET/POST| `/signup/`                | `signup_view`         | Registration page               |
| GET/POST| `/logout/`               | `logout_view`         | Logout                          |

---

## Access Control

| Action              | Job Seeker | Company Admin |
|---------------------|:----------:|:-------------:|
| Browse jobs         | ✅         | ✅            |
| Search jobs         | ✅         | ✅            |
| View job details    | ✅         | ✅            |
| Apply to a job      | ✅         | ❌            |
| View applied jobs   | ✅         | ❌            |
| Post a job          | ❌         | ✅            |
| Edit / Delete a job | ❌         | ✅ (own jobs) |
| View my jobs panel  | ❌         | ✅            |

---

## Configuration

Key settings in `mysite/settings.py`:

```python
AUTH_USER_MODEL = 'jobs.User'   # Custom user model
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
DEBUG = True                    # Set to False in production
```

The `SECRET_KEY` and `DEBUG` flag can be overridden via environment variables:

```bash
export SECRET_KEY="your-secret-key"
export DEBUG=False
```

---

## Requirements

```
Django==6.0.4
asgiref==3.11.1
sqlparse==0.5.5
tzdata==2026.2
```

---

## Notes

- The default database is SQLite, suitable for development only. Switch to PostgreSQL or MySQL for production.
- `DEBUG = True` by default — never deploy with this enabled.
- The `SECRET_KEY` in `settings.py` is a fallback insecure default; always set it via an environment variable in production.
- Static files must be collected before deploying: `python manage.py collectstatic`.
- Production security settings (HTTPS, HSTS, secure cookies) are automatically enabled when `DEBUG=False`.
