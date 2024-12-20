from django.db import models

class Project(models.Model):
    # id = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=255)
    website_url = models.URLField()
    description = models.TextField()
    sample_size = models.IntegerField()

    def __str__(self):
        return self.project_name

class Task(models.Model):
    task_number = models.CharField(max_length=50)
    task_name = models.CharField(max_length=255)
    participant_name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.task_name