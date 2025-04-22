from django.db import models
import uuid
from django.utils import timezone


# Create your models here.
class ServiceCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    USER_TYPE_CHOICES = [
        ("client", "Client"),
        ("worker", "Worker"),
        ("admin", "Admin"),
    ]

    QUALIFICATION_CHOICES = [
        ("high_school", "High School"),
        ("diploma", "Diploma"),
        ("bachelors", "Bachelor's Degree"),
        ("masters", "Master's Degree"),
        ("phd", "PhD"),
        ("other", "Other"),
    ]

    full_name = models.CharField(max_length=100, default="sample")
    email = models.EmailField(unique=True, default="sample@gmail.com")
    user_type = models.CharField(
        max_length=10, choices=USER_TYPE_CHOICES, default="client"
    )
    mobile_number = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    is_worker = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    highest_qualification = models.CharField(
        max_length=100, choices=QUALIFICATION_CHOICES, blank=True, null=True
    )
    experience = models.IntegerField(blank=True, null=True)
    service_category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="users",
    )
    hourly_rate = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    works = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.full_name}  ({self.id})"


class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted_jobs")
    deadline = models.DateField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    service_category = models.ForeignKey(
        ServiceCategory, on_delete=models.SET_NULL, null=True
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_jobs",
        db_column="job_worker_id",  # Custom column name
    )
    is_completed = models.BooleanField(default=False)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to="job_images/", blank=True, null=True)

    # Add any other fields you need
    def __str__(self):
        return str(self.title)


class JobAcceptance(models.Model):
    job = models.ForeignKey(Job, related_name="acceptances", on_delete=models.CASCADE)
    job_seekers = models.ManyToManyField(User, related_name="job_applications")
    status = models.CharField(
        max_length=20, default="pending"
    )  # pending, accepted, rejected
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assigned_job",
        null=True,
        db_column="acceptance_worker_id",  # Different custom column name
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return str(self.id)


class Complaint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="complaints")
    title = models.CharField(max_length=255)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.user.full_name}"


class AdminRegistrationCode(models.Model):
    code = models.CharField(max_length=50, unique=True)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Admin Code: {self.code} - {'Used' if self.is_used else 'Available'}"

    class Meta:
        verbose_name = "Admin Registration Code"
        verbose_name_plural = "Admin Registration Codes"
