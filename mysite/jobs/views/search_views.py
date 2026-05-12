from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from jobs.models import Job
from django.db.models import Q

@require_http_methods(["GET"])
def search(request):
    """Search for jobs - redirects to jobs page with filters when form is submitted"""
    
    job_title = request.GET.get('job_title', '').strip()
    location = request.GET.get('location', '').strip()
    experience = request.GET.get('experience', '').strip()
    salary = request.GET.get('salary', '').strip()
    
    # If any filter is provided, redirect to jobs page with filters
    if job_title or location or experience or salary:
        # Build query parameters for redirect
        params = {}
        if job_title:
            params['job_title'] = job_title
        if location:
            params['location'] = location
        if experience:
            params['experience'] = experience
        if salary:
            params['salary'] = salary
        
        # Redirect to jobs page with filters
        from django.urls import reverse
        url = reverse('job_list')
        if params:
            from urllib.parse import urlencode
            url += '?' + urlencode(params)
        
        return redirect(url)
    
    # Otherwise, show the search form
    return render(request, 'search.html')

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