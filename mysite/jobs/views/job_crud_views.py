from decimal import Decimal, InvalidOperation
from django.http import JsonResponse, HttpResponseForbidden
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from jobs.models import Job, Application
from jobs.utils import (
    get_job_with_owner_check, 
    get_application_with_user_check,
    check_job_application_exists,
    prepare_job_form_data,
    handle_ajax_response
)


# ============================================================
#  MEMBER 2 — Add Job / Edit Job / Delete Job
# ============================================================

def _validate_job_fields(post_data):
    """
    Validate job form fields from POST data.
    Returns (cleaned_data dict, errors dict).
    """
    errors = {}
    cleaned = {}

    # --- title ---
    title = post_data.get('job_title', '').strip()
    if not title:
        errors['title'] = 'Job title is required.'
    cleaned['title'] = title

    # --- description ---
    description = post_data.get('description', '').strip()
    if not description:
        errors['description'] = 'Description is required.'
    cleaned['description'] = description

    # --- salary ---
    salary_raw = post_data.get('salary', '').strip()
    if not salary_raw:
        errors['salary'] = 'Salary is required.'
        cleaned['salary'] = ''
    else:
        try:
            salary_val = Decimal(salary_raw)
            if salary_val <= 0:
                errors['salary'] = 'Salary must be greater than 0.'
            cleaned['salary'] = salary_raw
        except (InvalidOperation, ValueError):
            errors['salary'] = 'Salary must be a valid number.'
            cleaned['salary'] = salary_raw

    # --- status ---
    status = post_data.get('job_status', '').strip()
    valid_statuses = ['open', 'closed']
    if not status:
        errors['status'] = 'Status is required.'
    elif status not in valid_statuses:
        errors['status'] = 'Status must be "open" or "closed".'
    cleaned['status'] = status

    # --- years_of_experience ---
    yoe_raw = post_data.get('years_experience', '').strip()
    if not yoe_raw:
        errors['years_of_experience'] = 'Years of experience is required.'
        cleaned['years_of_experience'] = ''
    else:
        try:
            yoe_val = int(yoe_raw)
            if yoe_val < 0:
                errors['years_of_experience'] = 'Years of experience must be 0 or more.'
            cleaned['years_of_experience'] = yoe_raw
        except (ValueError, TypeError):
            errors['years_of_experience'] = 'Years of experience must be a whole number.'
            cleaned['years_of_experience'] = yoe_raw

    return cleaned, errors


@login_required(login_url='login')
def add_job(request):
    """Add a new job posting — only company admins."""
    # Access control: must be a company admin
    if not request.user.is_company_admin:
        return redirect('home')

    company_name = request.user.company_name or ''

    if request.method == 'POST':
        cleaned, errors = _validate_job_fields(request.POST)

        if errors:
            return render(request, 'add-job.html', {
                'errors': errors,
                'form_data': cleaned,
                'company_name': company_name,
            })

        # Save job
        Job.objects.create(
            title=cleaned['title'],
            description=cleaned['description'],
            salary=Decimal(cleaned['salary']),
            status=cleaned['status'],
            years_of_experience=int(cleaned['years_of_experience']),
            company_name=company_name,
            created_by=request.user,
        )
        return redirect('job_list')

    # GET — empty form
    return render(request, 'add-job.html', {
        'company_name': company_name,
    })


@login_required(login_url='login')
def edit_job(request, id):
    """Edit an existing job posting — owner only."""
    job = get_job_with_owner_check(request, id)
    
    # Check if it's an HttpResponseForbidden
    if hasattr(job, 'status_code'):
        return job

    if request.method == 'POST':
        cleaned, errors = _validate_job_fields(request.POST)

        if errors:
            return render(request, 'edit-job.html', {
                'errors': errors,
                'form_data': cleaned,
                'job': job,
                'company_name': request.user.company_name or '',
            })

        # Update job fields
        job.title = cleaned['title']
        job.description = cleaned['description']
        job.salary = Decimal(cleaned['salary'])
        job.status = cleaned['status']
        job.years_of_experience = int(cleaned['years_of_experience'])
        job.company_name = request.user.company_name or ''
        job.save()
        return redirect('job_list')

    # GET — pre-populate form with existing data
    form_data = prepare_job_form_data(job)
    return render(request, 'edit-job.html', {
        'job': job,
        'form_data': form_data,
        'company_name': job.company_name,
    })


@login_required(login_url='login')
def delete_job(request, id):
    """Delete a job posting — owner only, with confirmation."""
    job = get_job_with_owner_check(request, id)
    
    # Check if it's an HttpResponseForbidden
    if hasattr(job, 'status_code'):
        return job

    if request.method == 'POST':
        job.delete()
        return redirect('job_list')

    # GET — show confirmation page
    return render(request, 'confirm-delete.html', {'job': job})


# ============================================================
#  OTHER MEMBERS' VIEWS (not modified by Member 2)
# ============================================================

@login_required(login_url='login')
def apply_job(request, id):
    """Apply for a job"""
    job = get_object_or_404(Job, id=id)
    
    if request.method == 'POST':
        # Check if already applied
        existing = check_job_application_exists(request.user, job)
        
        if existing:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return handle_ajax_response(
                    False, 
                    'You already applied for this job', 
                    status=400
                )
            else:
                return redirect('job_details', id=id)
        
        # Create application
        Application.objects.create(user=request.user, job=job)
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return handle_ajax_response(True, 'Applied successfully!')
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
    # Check if user is a company admin
    if not request.user.is_company_admin:
        return redirect('home')
    
    jobs = Job.objects.filter(created_by=request.user)
    open_jobs_count = jobs.filter(status='open').count()
    closed_jobs_count = jobs.filter(status='closed').count()
    return render(request, 'my-jobs.html', {
        'jobs': jobs,
        'open_jobs_count': open_jobs_count,
        'closed_jobs_count': closed_jobs_count
    })

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