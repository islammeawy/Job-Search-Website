from django.shortcuts import render
from jobs.models import Job

def search(request):
    """Search for jobs"""
    query = request.GET.get('q', '')
    jobs = Job.objects.filter(
        title__icontains=query
    ) | Job.objects.filter(
        description__icontains=query
    ) | Job.objects.filter(
        company_name__icontains=query
    )
    return render(request, 'search.html', {'jobs': jobs, 'query': query})