from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser


class ServiceCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.id)


class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ("client", "Client"),
        ("worker", "Worker"),
    ]

    user_type = models.CharField(
        max_length=10, choices=USER_TYPE_CHOICES, default="client"
    )
    mobile_number = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    is_worker = models.BooleanField(default=False)
    highest_qualification = models.CharField(max_length=100, blank=True, null=True)
    experience = models.IntegerField(blank=True, null=True)
    service_category = models.CharField(max_length=100, blank=True, null=True)
    hourly_rate = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    client = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="posted_jobs"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    service_category = models.ForeignKey(
        ServiceCategory, on_delete=models.SET_NULL, null=True
    )
    is_completed = models.BooleanField(default=False)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=200)

    def __str__(self):
        return self.title


class JobImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="job_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.job.title}"


class Offer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    worker = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="offers_made",
        limit_choices_to={"is_worker": True},
    )
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE, related_name="offers_received"
    )
    worker_accepted = models.BooleanField(default=False)
    client_accepted = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["worker", "job"]

    @property
    def is_accepted(self):
        return self.worker_accepted and self.client_accepted

    def __str__(self):
        return f"Offer from {self.worker} for {self.job}"
