# Generated by Django 4.0.5 on 2022-06-23 20:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_remove_review_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]