from django.db import models
import uuid


# Create your models here.
class ServiceCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.id)


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    USER_TYPE_CHOICES = [
        ("client", "Client"),
        ("worker", "Worker"),
    ]

    QUALIFICATION_CHOICES = [
        ("high_school", "High School"),
        ("diploma", "Diploma"),
        ("bachelors", "Bachelor's Degree"),
        ("masters", "Master's Degree"),
        ("phd", "PhD"),
        ("other", "Other"),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
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

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.id})"


class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    client = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="posted_jobs"
    )
    deadline = models.DateField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    service_category = models.ForeignKey(
        ServiceCategory, on_delete=models.SET_NULL, null=True
    )
    is_completed = models.BooleanField(default=False)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=200)

    def __str__(self):
        return self.title
