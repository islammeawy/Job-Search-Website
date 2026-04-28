from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# Create your models here.

class User(AbstractUser):
    is_company_admin = models.BooleanField(default=False)
    company_name = models.CharField(max_length=200, blank=True, null=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='jobs_user_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='jobs_user_permissions',
        blank=True
    )
    def __str__(self):
        return self.username

class Job(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    STATUS_CHOICES = [('open', 'Open'), ('closed', 'Closed')]
    title = models.CharField(max_length=200)
    salary = models.DecimalField(max_digits=10, decimal_places=2 , null=True, blank=True)
    company_name = models.CharField(max_length=200)
    status = models.CharField(
    max_length=10, choices=STATUS_CHOICES, default='open')
    description = models.TextField()
    years_of_experience = models.IntegerField()

    created_by = models.ForeignKey(
      settings.AUTH_USER_MODEL, 
      on_delete=models.CASCADE,
      related_name='jobs_posted'
     )

    def __str__(self):
        return self.title

class Application(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications'  
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications' 
    )
    applied_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username} applied for {self.job.title}"

    class Meta:
        unique_together = ('user', 'job')  # prevents applying twice