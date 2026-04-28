from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from jobs.models import User

def login_view(request):
    """User login view"""
    if request.method == 'POST':
        # Handle login
        pass
    return render(request, 'login.html')

def signup_view(request):
    """User signup view"""
    if request.method == 'POST':
        # Handle signup
        pass
    return render(request, 'signup.html')

def logout_view(request):
    """User logout view"""
    logout(request)
    return redirect('home')