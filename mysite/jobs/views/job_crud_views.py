from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from jobs.models import Job, Application

@login_required(login_url='login')
def add_job(request):
    """Add a new job posting"""
    if request.method == 'POST':
        # Handle job creation
        pass
    return render(request, 'add-job.html')

@login_required(login_url='login')
def edit_job(request, id):
    """Edit an existing job posting"""
    job = get_object_or_404(Job, id=id)
    if request.method == 'POST':
        # Handle job update
        pass
    return render(request, 'edit-job.html', {'job': job})

@login_required(login_url='login')
def delete_job(request, id):
    """Delete a job posting"""
    job = get_object_or_404(Job, id=id)
    if request.method == 'POST':
        job.delete()
        return redirect('my_jobs')
    return render(request, 'edit-job.html', {'job': job})

@login_required(login_url='login')
def apply_job(request, id):
    """Apply for a job"""
    job = get_object_or_404(Job, id=id)
    if request.method == 'POST':
        # Handle application
        pass
    return render(request, 'job-details.html', {'job': job})

@login_required(login_url='login')
def applied_jobs(request):
    """View user's job applications"""
    applications = Application.objects.filter(user=request.user)
    return render(request, 'applied.html', {'applications': applications})

@login_required(login_url='login')
def my_jobs(request):
    """View user's posted jobs (for company admins)"""
    jobs = Job.objects.filter(created_by=request.user)
    return render(request, 'my-jobs.html', {'jobs': jobs})