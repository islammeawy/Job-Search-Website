from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_company_admin = models.BooleanField(default=False)
    company_name = models.CharField(max_length=200, blank=True, null=True)

class Job(models.Model):
    STATUS_CHOICES = [('open', 'Open'), ('closed', 'Closed')]
    title = models.CharField(max_length=200)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    company_name = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    description = models.TextField()
    years_of_experience = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')  # prevents applying twice