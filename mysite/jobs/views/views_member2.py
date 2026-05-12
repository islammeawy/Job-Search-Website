# ============================================================
#  MEMBER 2 — views_member2.py
#  Re-exports add_job, edit_job, delete_job from job_crud_views
#  so that both import paths work in urls.py.
# ============================================================

from .job_crud_views import add_job, edit_job, delete_job

__all__ = ['add_job', 'edit_job', 'delete_job']
