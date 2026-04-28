from django.urls import path
from .views import auth_views, job_views, job_crud_views, search_views
from .views.views import home
urlpatterns = [
    # Home page
    path('', home, name='home'),
    
    # Authentication routes
    path('login/', auth_views.login_view, name='login'),
    path('signup/', auth_views.signup_view, name='signup'),
    path('logout/', auth_views.logout_view, name='logout'),
    
    # Job listing and details
    path('jobs/', job_views.job_list, name='job_list'),
    path('jobs/<int:id>/', job_views.job_details, name='job_details'),
    
    # Job CRUD operations
    path('jobs/add/', job_crud_views.add_job, name='add_job'),
    path('jobs/<int:id>/edit/', job_crud_views.edit_job, name='edit_job'),
    path('jobs/<int:id>/delete/', job_crud_views.delete_job, name='delete_job'),
    
    # Job applications
    path('jobs/<int:id>/apply/', job_crud_views.apply_job, name='apply_job'),
    path('applied/', job_crud_views.applied_jobs, name='applied'),
    path('my-jobs/', job_crud_views.my_jobs, name='my_jobs'),
    
    # Search
    path('search/', search_views.search, name='search'),
]