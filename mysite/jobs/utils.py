"""
Utility functions for the jobs app to reduce code duplication
"""
from django.shortcuts import get_object_or_404
from django.http import HttpResponseForbidden
from jobs.models import Job, Application


def get_job_with_owner_check(request, job_id):
    """
    Get job object and verify ownership.
    Returns job object if user is owner, otherwise returns HttpResponseForbidden
    """
    job = get_object_or_404(Job, id=job_id)
    
    # Ownership check
    if job.created_by != request.user:
        return HttpResponseForbidden('You are not allowed to perform this action on this job.')
    
    return job


def get_application_with_user_check(application_id, user):
    """
    Get application object and verify ownership.
    Returns application object if user owns it, otherwise raises 404
    """
    return get_object_or_404(Application, id=application_id, user=user)


def check_job_application_exists(user, job):
    """
    Check if user has already applied for a job.
    Returns boolean indicating if application exists
    """
    return Application.objects.filter(user=user, job=job).exists()


def prepare_job_form_data(job=None):
    """
    Prepare form data for job creation/edit forms.
    Returns dictionary with initial form data
    """
    if job:
        return {
            'title': job.title,
            'description': job.description,
            'salary': job.salary,
            'status': job.status,
            'years_of_experience': job.years_of_experience,
        }
    return {}


def handle_ajax_response(success, message, data=None, status=200):
    """
    Standardize AJAX responses across the application.
    Returns JsonResponse with consistent format
    """
    response_data = {
        'success': success,
        'message': message
    }
    
    if data is not None:
        response_data.update(data)
    
    return JsonResponse(response_data, status=status)
