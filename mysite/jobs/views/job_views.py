from django.shortcuts import render
from jobs.models import Job
from django.db.models import Q

def job_list(request):
    """Display list of all jobs with optional search filters"""
    jobs = Job.objects.all()
    
    # Get search filters from query parameters
    job_title = request.GET.get('job_title', '').strip()
    location = request.GET.get('location', '').strip()
    experience = request.GET.get('experience', '').strip()
    salary = request.GET.get('salary', '').strip()
    
    # Apply filters
    if job_title:
        jobs = jobs.filter(
            Q(title__icontains=job_title) |
            Q(description__icontains=job_title)
        )
    
    if location:
        jobs = jobs.filter(company_name__icontains=location)
    
    if experience:
        try:
            if experience == "0-1":
                jobs = jobs.filter(years_of_experience__lte=1)
            elif experience == "2-4":
                jobs = jobs.filter(years_of_experience__gte=2, years_of_experience__lte=4)
            elif experience == "5+":
                jobs = jobs.filter(years_of_experience__gte=5)
        except ValueError:
            pass
    
    if salary:
        try:
            salary_value = float(salary)
            jobs = jobs.filter(salary__gte=salary_value)
        except ValueError:
            pass
    
    return render(request, 'jobs.html', {
        'jobs': jobs,
        'job_title': job_title,
        'location': location,
        'experience': experience,
        'salary': salary
    })

def job_details(request, id):
    """Display details of a specific job"""
    try:
        job = Job.objects.get(id=id)
    except Job.DoesNotExist:
        job = None
    return render(request, 'job-details.html', {'job': job})