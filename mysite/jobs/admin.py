from django.contrib import admin

from .models import Application, Job

# Register your models here.
admin.site.register(Job)
admin.site.register(Application)
admin.site.site_header = "Job Search Admin"
admin.site.site_title = "Job Search Admin Portal"