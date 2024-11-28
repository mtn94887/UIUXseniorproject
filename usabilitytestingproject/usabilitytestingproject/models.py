from django.db import models

class Project(models.Model):
    id = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=255)
    website_url = models.URLField(max_length=500)
    description = models.TextField()
    sample_size = models.IntegerField()

    def __str__(self):
        return self.project_name
