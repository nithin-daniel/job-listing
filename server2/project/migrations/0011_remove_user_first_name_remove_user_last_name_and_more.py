# Generated by Django 5.2 on 2025-04-17 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0010_alter_user_works'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='user',
            name='last_name',
        ),
        migrations.AddField(
            model_name='user',
            name='full_name',
            field=models.CharField(default='sample', max_length=100),
        ),
    ]
