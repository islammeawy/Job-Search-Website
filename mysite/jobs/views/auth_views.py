from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from jobs.models import User


@require_http_methods(["GET", "POST"])
def login_view(request):
    """User login view — authenticates against the database."""
    # Already logged in → go home
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        if not username or not password:
            messages.error(request, 'Please fill in all fields.')
            return render(request, 'login.html', {'username': username})

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome back, {user.get_full_name() or user.username}!')
            # Respect ?next= redirect (e.g. from @login_required)
            next_url = request.GET.get('next') or request.POST.get('next') or '/'
            return redirect(next_url)
        else:
            messages.error(request, 'Invalid username or password.')
            return render(request, 'login.html', {'username': username})

    return render(request, 'login.html')


@require_http_methods(["GET", "POST"])
def signup_view(request):
    """User signup view — creates a new user in the database."""
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        fullname      = request.POST.get('fullname', '').strip()
        email         = request.POST.get('email', '').strip()
        username      = request.POST.get('username', '').strip()
        password      = request.POST.get('password', '')
        confirm_pass  = request.POST.get('confirm_password', '')
        user_type     = request.POST.get('user_type', 'seeker')
        company_name  = request.POST.get('company_name', '').strip()
        terms         = request.POST.get('terms')

        # ── Validation ──────────────────────────────────────────────────────
        errors = []

        if not all([fullname, email, username, password, confirm_pass]):
            errors.append('Please fill in all required fields.')

        if password != confirm_pass:
            errors.append('Passwords do not match.')

        if len(password) < 8:
            errors.append('Password must be at least 8 characters long.')

        if user_type == 'company' and not company_name:
            errors.append('Please enter your company name.')

        if not terms:
            errors.append('You must agree to the Terms and Conditions.')

        if User.objects.filter(username=username).exists():
            errors.append('That username is already taken.')

        if User.objects.filter(email=email).exists():
            errors.append('An account with that email already exists.')

        if errors:
            for error in errors:
                messages.error(request, error)
            # Re-render with previously entered values so the user doesn't
            # have to retype everything
            return render(request, 'signup.html', {
                'fullname':     fullname,
                'email':        email,
                'username':     username,
                'user_type':    user_type,
                'company_name': company_name,
            })

        # ── Create user ──────────────────────────────────────────────────────
        # Split fullname into first / last for Django's built-in fields
        name_parts = fullname.split(' ', 1)
        first_name = name_parts[0]
        last_name  = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_company_admin=(user_type == 'company'),
            company_name=company_name if user_type == 'company' else '',
        )

        messages.success(request, 'Account created successfully! Please log in.')
        return redirect('login')

    return render(request, 'signup.html')


@require_http_methods(["GET", "POST"])
def logout_view(request):
    """Log the user out and redirect to home page."""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('home')
