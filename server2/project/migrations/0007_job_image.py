# Generated by Django 5.2 on 2025-04-08 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0006_alter_job_deadline'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='job_images/'),
        ),
    ]
