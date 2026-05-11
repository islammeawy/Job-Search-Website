from django.shortcuts import render
from jobs.models import Job

# Create your views here.
# Home page view
def home(request):
    jobs = Job.objects.filter(status='open').order_by('-created_at')[:6]  # Get latest 6 open jobs
    return render(request, 'index.html', {'jobs': jobs})
