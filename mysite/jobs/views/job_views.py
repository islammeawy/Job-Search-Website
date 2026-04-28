from django.shortcuts import render
from jobs.models import Job

def job_list(request):
    """Display list of all jobs"""
    jobs = Job.objects.all()
    return render(request, 'jobs.html', {'jobs': jobs})

def job_details(request, id):
    """Display details of a specific job"""
    try:
        job = Job.objects.get(id=id)
    except Job.DoesNotExist:
        job = None
    return render(request, 'job-details.html', {'job': job})