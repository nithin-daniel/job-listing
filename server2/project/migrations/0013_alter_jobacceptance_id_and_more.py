# Generated by Django 5.2 on 2025-04-18 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0012_rename_client_job_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobacceptance',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='jobacceptance',
            name='job_seekers',
            field=models.ManyToManyField(related_name='job_applications', to='project.user'),
        ),
        migrations.AlterField(
            model_name='jobacceptance',
            name='status',
            field=models.CharField(default='pending', max_length=20),
        ),
    ]
