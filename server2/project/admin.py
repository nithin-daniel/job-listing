from django.contrib import admin
from .models import ServiceCategory, User, Job, JobAcceptance

# Register your models here.
admin.site.register(ServiceCategory)
admin.site.register(User)
admin.site.register(Job)
admin.site.register(JobAcceptance)
