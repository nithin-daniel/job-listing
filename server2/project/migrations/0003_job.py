# Generated by Django 5.2 on 2025-04-07 17:20

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0002_auto_20250407_0916'),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_completed', models.BooleanField(default=False)),
                ('budget', models.DecimalField(decimal_places=2, max_digits=10)),
                ('location', models.CharField(max_length=200)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posted_jobs', to='project.user')),
                ('service_category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='project.servicecategory')),
            ],
        ),
    ]
