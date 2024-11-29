# Generated by Django 4.2.16 on 2024-11-29 06:09

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("project_name", models.CharField(max_length=255)),
                ("website_url", models.URLField()),
                ("description", models.TextField()),
                ("sample_size", models.IntegerField()),
            ],
        ),
    ]
