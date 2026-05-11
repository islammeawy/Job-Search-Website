from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required,require_http_methods
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
        # Check if already applied
        existing = Application.objects.filter(user=request.user, job=job).exists()
        
        if existing:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': 'You already applied for this job'
                }, status=400)
            else:
                return redirect('job_details', id=id)
        
        # Create application
        Application.objects.create(user=request.user, job=job)
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': 'Applied successfully!'
            })
        else:
            return redirect('applied')
    
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

@require_http_methods(["GET"])
def get_applied_jobs(request):
    """Get all applications for the logged-in user as JSON"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Not authenticated'}, status=401)
    
    applications = Application.objects.filter(user=request.user).select_related('job')
    
    results = []
    for app in applications:
        results.append({
            'id': app.id,
            'job': {
                'id': app.job.id,
                'title': app.job.title,
                'company_name': app.job.company_name,
                'salary': str(app.job.salary) if app.job.salary else 'Not specified',
                'years_of_experience': app.job.years_of_experience,
                'status': app.job.status,
                'description': app.job.description[:100] + '...' if len(app.job.description) > 100 else app.job.description,
            },
            'applied_at': app.applied_at.isoformat(),
        })
    
    return JsonResponse({
        'success': True,
        'count': len(results),
        'applications': results
    })


@require_http_methods(["POST"])
def withdraw_application(request, id):
    """Withdraw a job application"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Not authenticated'}, status=401)
    
    application = get_object_or_404(Application, id=id, user=request.user)
    
    try:
        application.delete()
        return JsonResponse({
            'success': True,
            'message': 'Application withdrawn successfully'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)