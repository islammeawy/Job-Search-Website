from django.shortcuts import render
from jobs.models import Job

# Create your views here.
# Home page view
def home(request):
    jobs = Job.objects.filter(is_active=True).order_by('-created_at')[:6]  # Get latest 6 active jobs
    return render(request, 'index.html', {'jobs': jobs})
