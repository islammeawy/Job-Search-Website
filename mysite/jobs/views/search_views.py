from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from jobs.models import Job
from django.db.models import Q

@require_http_methods(["GET"])
def search(request):
    """Search for jobs - supports both HTML and JSON (AJAX)"""
    
    query = request.GET.get('q', '').strip()
    job_title = request.GET.get('job_title', '').strip()
    location = request.GET.get('location', '').strip()
    experience = request.GET.get('experience', '').strip()
    salary = request.GET.get('salary', '').strip()
    
    jobs = Job.objects.filter(status='open')
    
    if query:
        jobs = jobs.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(company_name__icontains=query)
        )
    
    if job_title:
        jobs = jobs.filter(
            Q(title__icontains=job_title) |
            Q(description__icontains=job_title)
        )
    
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
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        results = []
        for job in jobs:
            results.append({
                'id': job.id,
                'title': job.title,
                'company_name': job.company_name,
                'salary': str(job.salary) if job.salary else 'Not specified',
                'years_of_experience': job.years_of_experience,
                'status': job.status,
                'description': job.description[:100] + '...' if len(job.description) > 100 else job.description,
            })
        
        return JsonResponse({
            'success': True,
            'count': len(results),
            'jobs': results
        })
    
    return render(request, 'search.html', {
        'jobs': jobs,
        'query': query or job_title,
        'location': location,
        'experience': experience,
        'salary': salary
    })

@require_http_methods(["GET"])
def get_all_jobs(request):
    """Get all open jobs as JSON"""
    jobs = Job.objects.filter(status='open').values(
        'id', 'title', 'company_name', 'salary', 
        'years_of_experience', 'status', 'description'
    )
    
    results = list(jobs)
    return JsonResponse({
        'success': True,
        'count': len(results),
        'jobs': results
    })